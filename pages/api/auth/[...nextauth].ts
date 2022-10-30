import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import type { DefaultUser } from "next-auth";

import { nextAuthAdapter } from "../../../db/models";

declare module "next-auth" {
  interface Session {
    user: DefaultUser;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env["EMAIL_SERVER_HOST"],
        port: process.env["EMAIL_SERVER_PORT"],
        auth: {
          user: process.env["EMAIL_SERVER_USER"],
          pass: process.env["EMAIL_SERVER_PASSWORD"],
        },
      },
      from: process.env["EMAIL_FROM"],
    }),
  ],
  adapter: nextAuthAdapter,
  callbacks: {
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      };
    },
  },
};

export default NextAuth(authOptions);
