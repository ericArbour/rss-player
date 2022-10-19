// NOTE this has to be a js file for sequelize-cli

require("dotenv").config();

const development = {
  username: process.env["DB_USER"],
  password: process.env["DB_PASS"],
  database: process.env["DB_NAME"],
  host: process.env["DB_HOST"],
  dialect: "postgres",
};

const test = {};
const production = {};

const config = {
  development,
  test,
  production,
};

module.exports = config;
