import { Box, css } from "@chakra-ui/react";
import React, { FC, useEffect, useRef, useState } from "react";
import ReactPlayer, { Config, ReactPlayerProps } from "react-player";
import IdentityData from "../interfaces/Identity";
import { MessageTypes } from "../interfaces/IMessage";
import SocketEvents from "../interfaces/SocketEvents";
import Message from "../util/Message";
import MessageUtil from "../util/MessageUtil";
import PlayerSocket from "../ws/websocket";

type PlayerProps = {
  id: string;
  socket: PlayerSocket;
  identity?: IdentityData;
} & ReactPlayerProps;

const Player: FC<PlayerProps> = (props) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [paused, setPaused] = useState<boolean>(false);
  const { socket } = props;
  const config: Config = {
    file: {
      forceHLS: true,
    },
  };
  useEffect(() => {
    if (playerRef.current && typeof props.identity !== "undefined") {
      console.log(props.identity.playhead);
      playerRef.current.seekTo(props.identity.playhead);
      setPaused(props.identity.paused);
    }
  }, []);
  socket.emitter.once(SocketEvents.SetPlayhead, (e) => {
    console.log(e);
    playerRef.current.seekTo(e.playhead);
    setPaused(e.paused);
  });
  const onSeek = (playedSeconds: number) => {
    if (!props.identity.admin) return;
    if (paused) {
      socket?.send(
        MessageUtil.encode(
          new Message(MessageTypes.SetPlayhead, {
            playhead: playedSeconds,
            paused: true,
          })
        )
      );
      return;
    }
    socket?.send(
      MessageUtil.encode(
        new Message(MessageTypes.SetPlayhead, {
          playhead: playedSeconds,
          paused: false,
        })
      )
    );
  };
  const onPause = () => {
    if (!props.identity.admin) return;
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
  const onPlay = () => {
    if (!props.identity.admin) return;
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
  return (
    <Box height="100vh" width="100vw">
      <ReactPlayer
        url={props.id}
        width="100%"
        height="100%"
        config={config}
        controls={props.identity.admin}
        onPlay={onPlay}
        onPause={onPause}
        onSeek={onSeek}
        ref={playerRef}
        playing={!paused}
        {...props}
      />
    </Box>
  );
};

export default Player;
