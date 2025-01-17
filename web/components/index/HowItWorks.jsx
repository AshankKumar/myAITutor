import styled from 'styled-components';

const MainContainer = styled.div`
  @media (max-width: 1200px) {
    font-size: 1em;
  }

  @media (max-width: 768px) {
    font-size: .75em;
  }

  @media (max-width: 550px) {
    font-size: .65em;
  }
`

const HowItWorksTitle = styled.h2`
  font-size: 4em;
  font-weight: bold;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4em;
  max-width: 80%;
  margin: 0 auto;

  @media (max-width: 1200px) {
    max-width: 90%;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const StepBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;

  @media (max-width: 1200px) {
    padding: 1rem 0.4rem 1rem 0.4rem;
  }
`;

const StackedLabels = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  margin: 0 2rem 0 2rem;

  @media (max-width: 500px) {
    margin: 0 0 0 0;
    padding: 0 1rem 0 1rem;
  }

  @media (max-width: 1200px) {
    margin: 0;
  }
`

const TextWithGif = styled.div`
  display: flex;
  flex-direction: ${({reverse}) => (reverse ? 'row-reverse' : 'row')};
  align-items: center;
  gap: 2rem;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;


const BigWords = styled.div`
  font-size: 3em;
`

const GradientText = styled.span`
  font-size: 1.4em;
  background: rgb(211, 131, 242);
  background: linear-gradient(90deg, rgba(211, 131, 242, 1) 0%, rgba(226, 43, 216, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const BoomText = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 2em;
  font-weight: bold;
  color: white;
  background: linear-gradient(to right, #ff1493, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;
const Subtitle = styled.div`
  padding: 1rem 0 0 0;
  font-size: 1.2em;
  text-align: left;
`;
const ValueList = styled.ul`
  padding: 0;
  margin: 0;
  list-style-image: url('/svg/bananas.svg');
  list-style-position: inside;
  font-size: 1em;
  @media (max-width: 768px) {
    font-size: 1.5em;
  }
`
const ListEntry = styled.li`
  margin-bottom: 1rem;
`
const GifVideo = styled.video`
  display: block;
  width: 50%;
  border-radius: 8px;
  box-shadow: 0 0 15px 0px rgba(255, 255, 255, 0.5);

  @media (max-width: 1200px) {
    width: 60%;
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const StepByStep = () => {
    return (
        <MainContainer>
            <HowItWorksTitle>How It Works</HowItWorksTitle>
            <GridContainer>
                <StepBox>
                    <TextWithGif reverse={true}>
                        <GifVideo autoPlay={true}
                                  loop={true}
                                  controls={false}
                                  muted
                                  playsInline
                                  alt="Step 1">
                            <source src="/gifs/step1.mp4" type="video/mp4"/>
                        </GifVideo>
                        <StackedLabels>
                            <BigWords>Upload Your Content</BigWords>
                            <GradientText>PDFs, Websites, MP4s, Youtube </GradientText>
                            <Subtitle>
                                <ValueList>
                                    <ListEntry>Upload the content you would like to summarize or query.</ListEntry>
                                    <ListEntry>Use our Chrome extension to quickly upload pages you visit!</ListEntry>
                                    <ListEntry>We even support large content, like textbooks and lecture
                                        videos.</ListEntry>
                                    <ListEntry>Automatic language detection and translation</ListEntry>

                                </ValueList>
                            </Subtitle>
                        </StackedLabels>
                    </TextWithGif>
                </StepBox>
                <StepBox>
                    <TextWithGif reverse={false}>
                        <GifVideo autoPlay={true}
                                  loop={true}
                                  controls={false}
                                  muted
                                  playsInline
                                  alt="Step 2">
                            <source src="/gifs/step2.mp4" type="video/mp4"/>
                        </GifVideo>
                        <StackedLabels>
                            <BigWords>We process the content and...</BigWords>
                            <BoomText>You go bananas</BoomText>
                            <Subtitle>
                                <ValueList>
                                    <ListEntry>Generating comprehensive summaries for your uploaded content is the least
                                        we can do.</ListEntry>
                                    <ListEntry>Quickly find the exact answers you are looking for, even if you can only
                                        provide a vague description.</ListEntry>
                                </ValueList>
                            </Subtitle>
                        </StackedLabels>
                    </TextWithGif>
                </StepBox>
            </GridContainer>
        </MainContainer>
    );
};

export default StepByStep;