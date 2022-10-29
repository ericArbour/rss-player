import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { sequelize } from "../../../db/models";
import SequelizeAdapter from "../../../db/models/next-auth-adapter";

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
  adapter: SequelizeAdapter(sequelize),
};

export default NextAuth(authOptions);
