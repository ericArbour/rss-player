import { Options, Sequelize } from "sequelize";
import process from "process";

import config from "../config/config";

const env = process.env.NODE_ENV || "development";
const envConfig = config[env] as Options;

export const sequelize = new Sequelize(envConfig);
