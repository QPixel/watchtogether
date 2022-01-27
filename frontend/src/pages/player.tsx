import { GetServerSideProps, NextPage } from "next";
import { User } from "next-auth";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useRef } from "react";
import ReactPlayer from "react-player";
import { Container } from "../components/Container";
import useWS from "../hooks/useWS";

const Player = dynamic(() => import("../components/Player"), { ssr: false });

interface PlayerPageProps {
  URI: string;
  user: User;
}

const PlayerPage: NextPage<PlayerPageProps> = ({ URI, user }) => {
  const playerRef = useRef<ReactPlayer>();
  const socket = useWS({ user });
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   const ws = new WebSocket(URI);
  //   ws.onopen = () => {
  //     ws.send(
  //       MessageUtil.encode(
  //         new Message(MessageTypes.Identify, {
  //           clientID: process.env.CLIENT_ID,
  //           user: {
  //             ID: user.id,
  //             Name: user.name,
  //           },
  //         })
  //       )
  //     );
  //     pingEvent(ws);
  //   };
  //   ws.onmessage = (event) => {
  //     console.log(event);
  //     console.log(JSON.parse(event.data));
  //   };
  //   ws.onclose = () => {
  //     ws.close();
  //   };
  //   ws.onerror = (err) => {
  //     console.log(err);
  //     return () => {
  //       ws.close();
  //     };
  //   };
  //   return () => {
  //     ws.close();
  //   };
  // }, []);
  return (
    <>
      <Head>
        <title>Watch Together</title>
      </Head>
      <Container height="100vh">
        <Player id="" ref={playerRef} />
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
