import React, { FC } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";

type PlayerProps = { id: string } & ReactPlayerProps;

const Player: FC<PlayerProps> = ({ id, config }) => {
  return <ReactPlayer url={id} config={config} />;
};

Player.defaultProps = {
  id: "",
  config: {
    file: {
      forceHLS: true,
    },
  },
};

export default Player;
