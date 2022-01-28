import React, { FC } from "react";
import { Flex, useColorMode, FlexProps } from "@chakra-ui/react";

export const Container: FC<FlexProps> = (props: FlexProps) => {
  const { colorMode } = useColorMode();

  const bgColor = { light: "gray.50", dark: "gray.900" };

  const color = { light: "black", dark: "white" };
  return (
    <Flex
      direction="column"
      justifyContent="flex-start"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      {...props}
    />
  );
};

Container.defaultProps = {
  alignItems: "center",
};
