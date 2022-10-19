import NextAuth, { NextAuthOptions } from "next-auth";
import SequelizeAdapter from "@next-auth/sequelize-adapter";
import { sequelize } from "../../../db/models";

sequelize.sync();

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
  ],
  adapter: SequelizeAdapter(sequelize),
};

export default NextAuth(authOptions);
