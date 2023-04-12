import React, { useRef } from "react";
import Layout from "../Layouts/basicLayout"
import styled from 'styled-components'
import Sidebar from "../components/settings/Sidebar";
import Section from "../components/settings/Section";
import UserInformation from "../components/settings/sections/UserInformation";
import ExtensionInformation from "../components/settings/sections/ExtensionInformation";
import SettingsContextProvider from "../components/settings/context";
import { NextSeo } from "next-seo";

const Container = styled.div`
  display: flex;
  min-height: 94.4vh;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Content = styled.div`
  margin-left: 300px;
  flex: 1;
  padding: 20px 1rem 1rem 1rem;
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const SidebarWrapper = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`

const InstallExtensionLink = styled.a`
  margin: 0 1rem 0 0;
  color: #bb6bd9;
  text-decoration: underline;
  font-weight: bold;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #e068e1;
  }
`;

const Settings = () => {
  const userInfoRef = useRef(null);
  const extensionKeyRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Container>
      <NextSeo
        title="Settings"
        description="Chimpbase Settings Page - Chimpbase is a game-changing information discovery platform, leveraging advanced AI technologies such as semantic search and chatGPT to deliver accurate, efficient and comprehensive insights from various sources including videos, documents, and websites. With AI-powered summarization and intuitive interfaces, Chimpbase is the ultimate solution for users seeking to deepen their understanding and knowledge."
      />
      <SettingsContextProvider>
        <SidebarWrapper>
          <Sidebar
            onUserInfoClick={() => scrollToSection(userInfoRef)}
            onExtensionKeyClick={() => scrollToSection(extensionKeyRef)} />
        </SidebarWrapper>
        <Content>
          <Section
            ref={userInfoRef}
            title="User Information"
          ><UserInformation /></Section>
          <Section
            ref={extensionKeyRef}
            title="Extension Key"
          >
            <ExtensionInformation />
            <InstallExtensionLink
              href="https://chrome.google.com/webstore/detail/chimpbase-page-collector/igcljiaagpkbcamaceaekidclckkmnkp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Extension Here
            </InstallExtensionLink>
            <InstallExtensionLink
              href="https://blog.chimpbase.com/blog/how-to-use-chimpbase-browser-extension-for-website-summarization"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tutorial
            </InstallExtensionLink>
          </Section>
        </Content>
      </SettingsContextProvider>
    </Container>
  );
};

Settings.PageLayout = Layout;

export default Settings;