import { DataTypes, Model, Options, Sequelize } from "sequelize";
import process from "process";

import config from "../config/config";
import { getNextAuthAdapterAndModels } from "./next-auth-adapter";

const env = process.env.NODE_ENV || "development";
const envConfig = config[env] as Options;

export const sequelize = new Sequelize(envConfig);

sequelize.sync();

export const { nextAuthAdapter, nextAuthModels } =
  getNextAuthAdapterAndModels(sequelize);

interface RssFeed {
  id: string;
  url: string;
  userId: string;
}

interface RssFeedInstance extends Model<RssFeed, Partial<RssFeed>>, RssFeed {}

const rssFeedAttributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isUrl: true },
  },
  userId: { type: DataTypes.UUID, allowNull: false },
};

export const RssFeed = sequelize.define<RssFeedInstance>(
  "rssFeed",
  rssFeedAttributes,
  {
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["url", "user_id"],
      },
    ],
  }
);

nextAuthModels.User.hasMany(RssFeed, { onDelete: "cascade" });
RssFeed.belongsTo(nextAuthModels.User, { onDelete: "cascade" });
