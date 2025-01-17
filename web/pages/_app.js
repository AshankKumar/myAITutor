import {ChakraProvider} from '@chakra-ui/react'
import {ThemeProvider} from 'styled-components'
import GlobalStyle from '../components/globalstyles'
import {Open_Sans, Buenard} from '@next/font/google'
import {Analytics} from '@vercel/analytics/react';


const openSans = Open_Sans({subsets: ['latin'], variable: '--font-open'},)
const buenard = Buenard({weight: "700", variable: '--font-b', subsets: ['latin'],})

import '/styles/globals.css'
import {SessionProvider} from "next-auth/react"
import Head from "next/head";

const theme = {
    colors: {
        primary: '#fbfbff',
        secondary: '#000000',
        green: '#39ff14',
        blue: '#89CFF0',
        pink: '#FF1f8f'
    },
}

function MyApp({
                   Component,
                   pageProps: {session, ...pageProps},
               }) {


    return (
        <ChakraProvider>
            <Head>
                <link rel="icon" href="/svg/bananas.svg"/>
            </Head>
            <ThemeProvider theme={theme}>
                <SessionProvider session={session}>
                    <GlobalStyle/>
                    <main className={`${openSans.className} ${openSans.variable} font-sans`}>
                        <style jsx global>{`
                          :root {
                            --font-b: ${buenard.style.fontFamily};
                          }
                        `}</style>
                        {Component.PageLayout ? (
                            <Component.PageLayout>
                                <Component {...pageProps} />
                            </Component.PageLayout>
                        ) : (
                            <Component {...pageProps} />
                        )}
                    </main>
                    <Analytics/>
                </SessionProvider>
            </ThemeProvider>
        </ChakraProvider>
    )
}

export default MyApp
