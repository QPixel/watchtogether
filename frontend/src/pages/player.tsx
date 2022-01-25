import consola from "consola";
import { GetServerSideProps, NextPage } from "next";
import { Session, User } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { Container } from "../components/Container";
import { MessageTypes } from "../interfaces/IMessage";
import Message from "../util/Message";
import MessageUtil from "../util/MessageUtil";

const Player = dynamic(() => import("../components/Player"), { ssr: false });

interface PlayerPageProps {
  URI: string;
  user: User;
}

const pingEvent = (ws: WebSocket) => {
  let interval = setInterval(() => {
    if (ws.readyState === ws.CLOSED) {
      clearInterval(interval);
      return;
    }
    console.log("running ping event");
    ws.send(MessageUtil.encode(new Message(MessageTypes.Ping)));
  }, 20000);
};

const PlayerPage: NextPage<PlayerPageProps> = ({ URI, user }) => {
  const playerRef = useRef<ReactPlayer>();
  consola.wrapAll();
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
      pingEvent(ws);
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
  return (
    <Container height="100vh">
      <Player id="" ref={playerRef} />
    </Container>
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
      URI: process.env.WS_URI,
      user: session.user,
    },
  };
};

export default PlayerPage;
