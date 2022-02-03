import { Button, Link as ChakraLink, Text } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { getSession, signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Container } from "../components/Container";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Main } from "../components/Main";
import { isDev } from "../util";

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Watch Together</title>
      </Head>
      <Container height="100vh">
        <Hero />
        <Main>
          <Button
            maxWidth="200"
            alignSelf="center"
            onClick={() => signIn("discord")}
            disabled={!isDev()}
          >
            Login With Discord
          </Button>
        </Main>
        <Footer>
          <ChakraLink>
            <Link href="https://velvox.dev" passHref>
              <Text>&copy;2022 Velvox</Text>
            </Link>
          </ChakraLink>
        </Footer>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const isDev = true;
  if (session && !isDev) {
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
