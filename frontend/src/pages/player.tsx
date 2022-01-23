import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React from "react";
import { Container } from "../components/Container";

const Player = dynamic(() => import("../components/Player"));

interface PlayerPage {
  id: string;
}

const PlayerPage: NextPage = () => {
  return (
    <Container height="100vh">
      <Player />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      id: "BELLE",
    },
  };
};

export default PlayerPage;
