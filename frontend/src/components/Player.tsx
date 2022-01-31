import { Box, css } from "@chakra-ui/react";
import React, { FC, useRef, useState } from "react";
import ReactPlayer, { Config, ReactPlayerProps } from "react-player";
import { MessageTypes } from "../interfaces/IMessage";
import SocketEvents from "../interfaces/SocketEvents";
import Message from "../util/Message";
import MessageUtil from "../util/MessageUtil";
import PlayerSocket from "../ws/websocket";

type PlayerProps = {
  id: string;
  socket: PlayerSocket;
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
  socket.emitter.on(SocketEvents.GetPlayhead, (e) => {
    playerRef.current.seekTo(e.playhead);
  });
  const onSeek = (playedSeconds: number) => {
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
        controls
        onPlay={onPlay}
        onPause={onPause}
        onSeek={onSeek}
        ref={playerRef}
        {...props}
      />
    </Box>
  );
};

export default Player;
