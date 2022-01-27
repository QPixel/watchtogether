import { GetServerSideProps, NextPage } from "next";
import { User } from "next-auth";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Container } from "../components/Container";
import useWS from "../hooks/useWS";
import IdentityData from "../interfaces/Identity";
import { MessageTypes } from "../interfaces/IMessage";
import isBrowser from "../util/isBrowser";

const Player = dynamic(() => import("../components/Player"), { ssr: false });

interface PlayerPageProps {
  URI: string;
  user: User;
}

const PlayerPage: NextPage<PlayerPageProps> = ({ URI, user }) => {
  const playerRef = useRef<ReactPlayer>();
  const socket = useWS({ user });
  const [id, setID] = useState<string>("");
  if (isBrowser() && typeof socket !== "undefined") {
    socket.emitter.on("Identify", (e: IdentityData) => {
      console.log(e);
      setID(e.playlist);
    });
  }

  return (
    <>
      <Head>
        <title>Watch Together</title>
      </Head>
      <Container height="100vh">
        <Player id={id} ref={playerRef} />
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
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
      user: session.user,
    },
  };
};

export default PlayerPage;
