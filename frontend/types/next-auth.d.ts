import NextAuth, { Session as NextSession, User as NextUser } from "next-auth";

declare module "next-auth" {
  interface User extends NextUser {
    id: string;
  }
  interface Session extends NextSession {
    user: User;
  }
}
