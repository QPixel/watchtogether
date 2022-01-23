import { GetServerSideProps, NextPage } from "next";
import React, { useEffect } from "react";
import { Container } from "../../components/Container";
import { Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  getSession,
  signOut,
  SignOutResponse,
  useSession,
} from "next-auth/react";

const SignOutPage: NextPage = () => {
  const router = useRouter();
  const session = useSession();
  let data: SignOutResponse | null;
  const signout = async () => {
    data = await signOut({ redirect: false, callbackUrl: "/" });
  };
  if (session) {
    useEffect(() => {
      signout();
      setTimeout(() => {
        if (data) {
          router.push(data.url);
        } else {
          router.push("/");
        }
      }, 600);
    }, []);
  }
  return (
    <Container height="100vh">
      <Text>Signing out!</Text>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default SignOutPage;
