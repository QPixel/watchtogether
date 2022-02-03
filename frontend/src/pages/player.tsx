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
import { MessageTypes } from "../interfaces/IMessage";
import SetPlayheadEvent from "../interfaces/Playhead";
import SocketEvents from "../interfaces/SocketEvents";
import { isBrowser } from "../util";
import Message from "../util/Message";
import MessageUtil from "../util/MessageUtil";

interface PlayerPageProps {
  user: User;
}
// types for the function

const PlayerPage: NextPage<PlayerPageProps> = ({ user }) => {
  const socket = useWS({ user });
  const playerRef = useRef<ReactPlayer>();
  const [id, setID] = useState<string>("");
  const [identity, setIdentity] = useState<IdentityData>();
  const [paused, setPaused] = useState<boolean>(true);

  useEffect(() => {
    if (isBrowser() && typeof socket !== "undefined") {
      socket?.emitter.once(SocketEvents.Identify, (e: IdentityData) => {
        setID(e.playlist);
        setIdentity(e);
        playerRef?.current.seekTo(e.playhead);
        setPaused(e.paused);
      });
      socket?.emitter.on(SocketEvents.SetPlayhead, (e: SetPlayheadEvent) => {
        console.log(e.paused);
        setPaused(e.paused);
        playerRef.current.seekTo(e.playhead);
      });
    }
  }, [socket]);
  const onPlay = () => {
    if (!identity.admin) return;
    setPaused(false);
    socket?.send(
      MessageUtil.encode(
        new Message(MessageTypes.SetPlayhead, {
          playhead: playerRef.current.getCurrentTime(),
          paused: false,
        })
      )
    );
  };
  const onSeek = (playedSeconds: number) => {
    if (!identity.admin) return;
    socket.send(
      MessageUtil.encode(
        new Message(MessageTypes.SetPlayhead, {
          playhead: playedSeconds,
          paused: paused,
        })
      )
    );
  };
  const onPause = () => {
    console.log("running now");
    if (!identity.admin) return;
    setPaused(true);
    socket?.send(
      MessageUtil.encode(
        new Message(MessageTypes.SetPlayhead, {
          playhead: playerRef.current.getCurrentTime(),
          paused: true,
        })
      )
    );
  };
  return (
    <>
      <Head>
        <title>Watch Together</title>
      </Head>
      <Container height="100vh" background={"#000"}>
        <Player
          url={id}
          onPlay={onPlay}
          onPause={onPause}
          onSeek={onSeek}
          controls={identity?.hasController}
          playing={!paused}
          ref={playerRef}
        />
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
