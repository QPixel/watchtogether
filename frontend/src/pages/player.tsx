import { Socket } from "dgram";
import { GetServerSideProps, NextPage } from "next";
import { User } from "next-auth";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { BaseReactPlayerProps } from "react-player/base";
import { Container } from "../components/Container";
import useWS from "../hooks/useWS";
import IdentityData from "../interfaces/Identity";
import { MessageTypes } from "../interfaces/IMessage";
import SocketEvents from "../interfaces/SocketEvents";
import isBrowser from "../util/isBrowser";
import Message from "../util/Message";
import MessageUtil from "../util/MessageUtil";

const Player = dynamic(() => import("../components/Player"), { ssr: false });

interface PlayerPageProps {
  user: User;
}
// types for the function

const PlayerPage: NextPage<PlayerPageProps> = ({ user }) => {
  // const playerRef = useRef<ReactPlayer>();
  const socket = useWS({ user });
  const [id, setID] = useState<string>("");
  const [identity, setIdentity] = useState<IdentityData>();
  if (isBrowser() && typeof socket !== "undefined") {
    socket.emitter.on(SocketEvents.Identify, (e: IdentityData) => {
      console.log(e);
      setID(e.playlist);
      setIdentity(e);
    });
  }
  return (
    <>
      <Head>
        <title>Watch Together</title>
      </Head>
      <Container height="100vh" background={"#000"}>
        <Player id={id} socket={socket} />
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
