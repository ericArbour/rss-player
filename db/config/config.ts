import { Options } from "sequelize";

const development: Options = {
  username: process.env["DB_USER"],
  password: process.env["DB_PASS"],
  database: process.env["DB_NAME"],
  host: process.env["DB_HOST"],
  dialect: "postgres",
};

const test: Options = {};
const production: Options = {};

export const config = {
  development,
  test,
  production,
};
