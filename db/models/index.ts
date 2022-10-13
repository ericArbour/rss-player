import { Sequelize, DataTypes } from "sequelize";
import process from "process";

import { config } from "../config/config";
import { userInitializer } from "./user";

const env = process.env.NODE_ENV || "development";
const envConfig = config[env];

const sequelize = new Sequelize(envConfig);

export const User = userInitializer(sequelize, DataTypes);
