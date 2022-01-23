import { Text } from "@chakra-ui/layout";
import { Flex as Box } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import React from "react";
import { Container } from "../../components/Container";
import Header from "../../components/Header";
import UserData from "../../components/UserData";

interface AdminPageProps {
  isAuthed: boolean;
  isAdmin: boolean;
  session?: Session;
}

const AdminPage: NextPage<AdminPageProps> = ({
  isAuthed,
  isAdmin,
  session,
}) => {
  return (
    <>
      <Container height="100vh">
        <Header>
          <UserData user={session.user} />
        </Header>
        <Container
          height="30vh"
          mt="5rem"
          backgroundColor="gray.700"
          width="100vw"
        >
          <Text>Hello</Text>
        </Container>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    const isAdmin = session.user.name.includes("qpixel");
    if (!isAdmin) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {
        isAuthed: true,
        isAdmin: isAdmin,
        session: session,
      } as AdminPageProps,
    };
  }
  return {
    props: {
      isAdmin: false,
      isAuthed: false,
    } as AdminPageProps,
  };
};

export default AdminPage;
