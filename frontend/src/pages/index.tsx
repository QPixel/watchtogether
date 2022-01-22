import { Button, Text } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { getSession, signIn } from "next-auth/react";
import React from "react";
import { Container } from "../components/Container";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Main } from "../components/Main";

const Index: NextPage = () => {
  return (
    <Container height="100vh">
      <Hero />
      <Main>
        <Button
          maxWidth="200"
          alignSelf="center"
          onClick={() => signIn("discord")}
        >
          Login With Discord
        </Button>
      </Main>
      <Footer>
        <Text>&copy;2022 Velvox</Text>
      </Footer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/player",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default Index;
