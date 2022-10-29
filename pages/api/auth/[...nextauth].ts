import NextAuth, { NextAuthOptions } from "next-auth";
import { sequelize } from "../../../db/models";
import SequelizeAdapter from "../../../db/models/next-auth-adapter";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
  ],
  adapter: SequelizeAdapter(sequelize),
};

export default NextAuth(authOptions);
