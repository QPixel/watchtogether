import { NextPage } from "next";
import dynamic from "next/dynamic";
import React from "react";
import { Container } from "../components/Container";

const Player = dynamic(() => import("../components/Player"));

const PlayerPage: NextPage = () => {
  return (
    <Container height="100vh">
      <Player />
    </Container>
  );
};

export default PlayerPage;
