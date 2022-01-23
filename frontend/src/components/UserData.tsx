import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Session } from "next-auth";
import React, { FC } from "react";

interface UserDataProps {
  user: Session["user"];
}

const UserData: FC<UserDataProps> = ({ user: { name, image } }) => {
  return (
    <Flex alignSelf="flex-end" mr="2" mt="1">
      <Avatar src={image} />
      <Box ml="3" mt="2">
        <Text fontWeight="bold">{name}</Text>
      </Box>
    </Flex>
  );
};

export default UserData;
