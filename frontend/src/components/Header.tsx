import { Box, Flex, Heading } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import React, { FC } from "react";

const Header: FC = ({ children }) => {
  return (
    <Flex
      as="header"
      position="fixed"
      w="100%"
      justifyContent="space-between"
      outline="1"
      padding="1"
    >
      <Flex
        alignSelf="flex-start"
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        bgClip="text"
        height="100%"
      >
        <Heading fontSize="2rem">Watch Together</Heading>
        <Text
          fontStyle="italic"
          ml="2"
          mt="1"
          fontSize="2xl"
          fontWeight="semibold"
        >
          admin
        </Text>
      </Flex>
      {children}
    </Flex>
  );
};

export default Header;
