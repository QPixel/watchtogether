import { GetServerSideProps, NextPage } from "next";
import { User } from "next-auth";
import { getSession } from "next-auth/react";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Container } from "../components/Container";
import Player from "../components/Player";
import useWS from "../hooks/useWS";
import IdentityData from "../interfaces/Identity";
import SetPlayheadEvent from "../interfaces/Playhead";
import SocketEvents from "../interfaces/SocketEvents";
import { isBrowser } from "../util";
import PlayerSocket from "../ws/websocket";

interface PlayerPageProps {
  user: User;
}
// types for the function

const PlayerPage: NextPage<PlayerPageProps> = ({ user }) => {
  const socket = useWS({ user });
  const playerRef = useRef<ReactPlayer>();
  const [id, setID] = useState<string>("");
  const [identity, setIdentity] = useState<IdentityData>();
  useEffect(() => {
    if (isBrowser() && typeof socket !== "undefined") {
      socket?.emitter.once(SocketEvents.Identify, (e: IdentityData) => {
        setID(e.playlist);
        setIdentity(e);
      });
      socket?.emitter.on(SocketEvents.SetPlayhead, (e: SetPlayheadEvent) => {
        console.log(e);
      });
    }
  }, [socket]);
  const onSeek = () => {};
  return (
    <>
      <Head>
        <title>Watch Together</title>
      </Head>
      <Container height="100vh" background={"#000"}>
        <Player ref={playerRef} />
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
