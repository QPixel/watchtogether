import { GetServerSideProps, NextPage } from "next";
import { Session, User } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { Container } from "../components/Container";
import { MessageTypes } from "../interfaces/IMessage";
import Message from "../util/Message";
import MessageUtil from "../util/MessageUtil";

const Player = dynamic(() => import("../components/Player"), { ssr: false });

interface PlayerPageProps {
  URI: string;
  user: User;
}
const PlayerPage: NextPage<PlayerPageProps> = ({ URI, user }) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ws = new WebSocket(URI);
    ws.onopen = () => {
      ws.send(
        MessageUtil.encode(
          new Message(MessageTypes.Identify, {
            clientID: process.env.CLIENT_ID,
            user: {
              ID: user.id,
              Name: user.name,
            },
          })
        )
      );
    };
    ws.onmessage = (event) => {
      console.log(event);
      console.log(JSON.parse(event.data));
    };
    ws.onclose = () => {
      ws.close();
    };
    ws.onerror = (err) => {
      console.log(err);
      return () => {
        ws.close();
      };
    };
    return () => {
      ws.close();
    };
  }, []);
  return <Container height="100vh">{/* <Player /> */}</Container>;
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
      URI: process.env.WS_URI,
      user: session.user,
    },
  };
};

export default PlayerPage;
