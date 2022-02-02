import { Box } from "@chakra-ui/react";
import React, { forwardRef } from "react";
import ReactPlayer, { Config, ReactPlayerProps } from "react-player";

const Player = forwardRef<ReactPlayer, ReactPlayerProps>((props, ref) => {
  const config: Config = {
    file: {
      forceHLS: true,
    },
  };
  // useEffect(() => {
  //   if (playerRef.current && typeof props.identity !== "undefined") {
  //     console.log(props.identity.playhead);
  //     playerRef.current.seekTo(props.identity.playhead);
  //     setPaused(props.identity.paused);
  //   }
  // }, []);
  // socket.emitter.once(SocketEvents.SetPlayhead, (e) => {
  //   console.log(e);
  //   playerRef.current.seekTo(e.playhead);
  //   setPaused(e.paused);
  // });
  // const onSeek = (playedSeconds: number) => {
  //   if (!props.identity.admin) return;
  //   if (paused) {
  //     socket?.send(
  //       MessageUtil.encode(
  //         new Message(MessageTypes.SetPlayhead, {
  //           playhead: playedSeconds,
  //           paused: true,
  //         })
  //       )
  //     );
  //     return;
  //   }
  //   socket?.send(
  //     MessageUtil.encode(
  //       new Message(MessageTypes.SetPlayhead, {
  //         playhead: playedSeconds,
  //         paused: false,
  //       })
  //     )
  //   );
  // };
  // const onPause = () => {
  //   if (!props.identity.admin) return;
  //   setPaused(true);
  //   socket?.send(
  //     MessageUtil.encode(
  //       new Message(MessageTypes.SetPlayhead, {
  //         playhead: playerRef.current.getCurrentTime(),
  //         paused: true,
  //       })
  //     )
  //   );
  // };
  // const onPlay = () => {
  //   if (!props.identity.admin) return;
  //   setPaused(false);
  //   socket?.send(
  //     MessageUtil.encode(
  //       new Message(MessageTypes.SetPlayhead, {
  //         playhead: playerRef.current.getCurrentTime(),
  //         paused: false,
  //       })
  //     )
  //   );
  // };
  return (
    <Box height="100vh" width="100vw">
      <ReactPlayer
        url={props.url}
        width="100%"
        height="100%"
        config={config}
        ref={ref}
        {...props}
      />
    </Box>
  );
});

export default Player;
