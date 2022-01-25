import React, { FC } from "react";
import ReactPlayer, { Config, ReactPlayerProps } from "react-player";

type PlayerProps = { id: string } & ReactPlayerProps;

const Player: FC<PlayerProps> = (props) => {
  const config: Config = {
    file: {
      forceHLS: true,
    },
  };
  return <ReactPlayer url={props.id} config={config} {...props} />;
};

export default Player;
