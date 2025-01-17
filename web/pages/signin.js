import {getProviders, signIn, getCsrfToken} from "next-auth/react"
import {getServerSession} from "next-auth/next"
import {authOptions} from "./api/auth/[...nextauth]";
import React, {useEffect, useState} from "react"
import {FcGoogle} from "react-icons/fc";
import {AiOutlineMail} from "react-icons/ai"
import styles from "/styles/signin.module.scss"
import Link from "next/link";
import styled, {keyframes} from "styled-components";
import {FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, useToast} from "@chakra-ui/react";
import {useRouter} from 'next/router';
import {NextSeo} from "next-seo";

const NavbarContainer = styled.nav`
  height: 50px;
  background-color: #242933;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: #57657e 2px solid;
  @media (max-width: 600px) {
    height: 75px;
  }
`
const Logo = styled(Link)`
  font-family: var(--font-b);
  font-weight: 700;
  font-size: 30px;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  padding-left: 30px;
  padding-right: 30px;
`;

function Navbar(props) {
    return (
        <NavbarContainer>
            <Logo href={'/'}>
                chimpbase
            </Logo>
        </NavbarContainer>
    );
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #52a1fc;
`

const PageContainer = styled.div`
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #242933;
  border: 2px solid #fff;
  border-radius: 4px;
  padding: 20px;
  width: 300px;
  @media (max-width: 300px) {
    width: 250px;
  }
  @media (min-width: 420px) {
    width: 350px;
  }

`

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #242933;
  background-color: #57657e;
  padding: 0.75rem 1rem;
  color: #fff;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  @media (max-width: 300px) {
    font-size: .75rem;
  }
`

const EmailContainer = styled.div`
  width: 100%;
`

const Or = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  color: #fff;
  font-weight: 500;
`
const CreateAccount = styled.button`
  margin-top: 10px;
  width: 100%;
  text-align: left;
  color: #52a1fc;
`
const TOSAgreement = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  color: white;
`

const TOSLink = styled(Link)`
  color: #52a1fc;
`
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LargeSpinner = styled.div`
  position: relative;
  display: inline-block;
  width: 4rem;
  height: 4rem;
  border: 0.4rem solid rgba(0, 0, 0, 0.1);
  border-left-color: #1a1a1a;
  border-radius: 50%;
  animation: ${rotate} 1.2s linear infinite;

  &::before {
    content: "⚡";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
  }
`;

export default function SignIn({csrfToken, providers}) {
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState('');
    const [isEmailInvalid, setIsEmailInvalid] = useState(false);
    const toast = useToast()
    const toastIdRef = React.useRef()
    const router = useRouter();
    const [formLoading, setFormLoading] = useState(false)

    const { error, callbackUrl } = router.query;

    useEffect(()=>{
        if (error=="OAuthAccountNotLinked") {
            toastIdRef.current = toast({
                position: 'top',
                description: "We apologize for the inconvenience, please sign in using email instead."
            })
        }
    }, [error])

    const googleSignIn = async (e) => {
        e.preventDefault()
        setFormLoading(true)
        try {
            let googleProvider = Object.values(providers).filter(provider => provider.name == "Google")
            const response = await signIn(googleProvider[0].id)
            if (response) {
                const {error, status, ok, url} = response
                if (ok) {
                    console.log("signin success")
                    router.push('/home')
                } else {
                    console.log(error)
                    toastIdRef.current = toast({
                        position: 'top',
                        description: `Error with SignIn: ${error}. Sometimes Google OAuth errors are cause by already having made an account using the email box below.`
                    })
                }
            }
        } catch (e) {
            console.log(e)
            toastIdRef.current = toast({
                position: 'top',
                description: `Error with SignIn: ${e.message} \n`
            })
        }
        setFormLoading(false)
    }

    const emailSignIn = async (e) => {
        e.preventDefault()
        setFormLoading(true)
        try {
            const emailRegex =
                /^(?=[a-z0-9@._%+-]{6,254}$)[a-z0-9._%+-]{1,64}@(?:[a-z0-9-]{1,63}\.){1,8}[a-z]{2,63}$/;
            if (!emailRegex.test(email.toLowerCase())) {
                console.log('here')
                setIsEmailInvalid(true)
                return;
            }
            const response = await fetch(
                `/api/auth/signin/email`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        'email': email,
                        'csrfToken': csrfToken,
                    }),
                }).then((response) => {
                if (response.ok) {
                    toastIdRef.current = toast({
                        position: 'top',
                        description: `Link Sent! Check Your Email for the Sign ${isSignIn ? 'In' : 'Up'} Link`
                    })
                } else {
                    toastIdRef.current = toast({
                        position: 'top',
                        description: `Sorry, there was an issue on our end. Refresh this page and try again.`
                    })
                }
            })
        } catch (e) {
            console.log(e)
            toastIdRef.current = toast({
                position: 'top',
                description: `Error with SignIn: ${e.message} \n`
            })
        }
        setFormLoading(false)
    };

    return (
        <Container>
            <NextSeo
                title="Sign In"
                description="Sign In to Chimpbase. Chimpbase is a game-changing information discovery platform, leveraging advanced AI technologies such as semantic search and chatGPT to deliver accurate, efficient and comprehensive insights from various sources including videos, documents, and websites. With AI-powered summarization and intuitive interfaces, Chimpbase is the ultimate solution for users seeking to deepen their understanding and knowledge."
            />
            <Navbar/>
            <PageContainer>
                {formLoading ?
                    <>
                        <LargeSpinner/>
                    </>
                    :
                    <>
                        <object className={styles.monkeyIcon} data={"/svg/monkey1.svg"}/>
                        <SignInContainer>
                            <TOSAgreement>
                                By Signing {isSignIn ? 'In' : 'Up'}, you accept our &nbsp;
                                <TOSLink href={'/tos'}>
                                    Terms of Service.
                                </TOSLink>
                            </TOSAgreement>
                            <Button onClick={googleSignIn}>
                                <FcGoogle size={22} style={{marginRight: '5px'}}/>
                                Sign {isSignIn ? 'In' : 'Up'} with Google
                            </Button>
                            <Or>
                                Or
                            </Or>
                            <EmailContainer>
                                <FormControl isInvalid={isEmailInvalid} marginBottom={'10px'} id="email" isRequired>
                                    <FormLabel color={'#fff'}>Email address</FormLabel>
                                    <Input borderColor={'#57657e'}

                                           value={email}
                                           onChange={e => setEmail(e.target.value)}
                                           color={'#fff'} type="email" placeholder="Enter your email address"/>
                                    {!isEmailInvalid ? (
                                        <FormHelperText color={'#fff'}>
                                            We&apos;ll never share your email.
                                        </FormHelperText>
                                    ) : (
                                        <FormErrorMessage>Invalid Email</FormErrorMessage>
                                    )}
                                </FormControl>

                                <Button onClick={emailSignIn}>
                                    <AiOutlineMail size={22} style={{marginRight: '5px'}}/>
                                    Sign {isSignIn ? 'In' : 'Up'} with Email
                                </Button>
                            </EmailContainer>
                            <CreateAccount onClick={() => setIsSignIn(!isSignIn)}>
                                {isSignIn ? 'Newbie? Let\'s Sign Up! 😎' :
                                    'Back to Sign In? 😁'}
                            </CreateAccount>
                        </SignInContainer>
                    </>
                }
            </PageContainer>
        </Container>
    )
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);
    const csrfToken = await getCsrfToken(context)

    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!

    if (session) {
        return {redirect: {destination: "/home"}};
    }

    const providers = await getProviders(context);

    return {
        props: {providers: Object.values(providers) ?? [], csrfToken},
    }
}