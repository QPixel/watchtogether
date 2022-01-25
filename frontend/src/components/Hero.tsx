import { Flex, Heading, keyframes } from "@chakra-ui/react";
import { css } from "@emotion/react";

const gradient = keyframes`
0% { background-position: 0% 0%; }
100% { background-position: 100% 0%; }
}
`;

export const Hero = ({ title }: { title: string }) => (
  <Flex
    justifyContent="center"
    alignItems="center"
    height="100vh"
    backgroundImage="linear-gradient(90deg,#cf5c5c,#c19b4a,#def2a0,#c6ee4a,#42eca6,#64b3d9,#208ea2,#498ada,#5b73df,#897ed3,#cf5c5c,#c19b4a)"
    backgroundSize="1100% 100%"
    bgClip="text"
    css={css`
      animation: ${gradient} 14s linear infinite;
    `}
  >
    <Heading fontSize="6vw">{title}</Heading>
  </Flex>
);

Hero.defaultProps = {
  title: "Watch Together",
};
