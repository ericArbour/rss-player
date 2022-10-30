// Sources
// https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-sequelize/src/index.ts
// https://medium.com/@andrewoons/how-to-define-sequelize-associations-using-migrations-de4333bf75a7
// https://next-auth.js.org/adapters/models

import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "next-auth/adapters";
import { Sequelize, Model, DataTypes, ModelStatic } from "sequelize";

const AccountAttributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: { type: DataTypes.STRING, allowNull: false },
  provider: { type: DataTypes.STRING, allowNull: false },
  providerAccountId: { type: DataTypes.STRING, allowNull: false },
  refresh_token: { type: DataTypes.STRING },
  access_token: { type: DataTypes.STRING },
  expires_at: { type: DataTypes.INTEGER },
  token_type: { type: DataTypes.STRING },
  scope: { type: DataTypes.STRING },
  id_token: { type: DataTypes.STRING },
  session_state: { type: DataTypes.STRING },
  userId: { type: DataTypes.UUID },
};

export const UserAttributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING },
  email: {
    type: DataTypes.STRING,
    unique: "email",
    validate: { isEmail: true },
  },
  emailVerified: { type: DataTypes.DATE },
  image: { type: DataTypes.STRING },
};

export const SessionAttributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  expires: { type: DataTypes.DATE, allowNull: false },
  sessionToken: {
    type: DataTypes.STRING,
    unique: "sessionToken",
    allowNull: false,
  },
  userId: { type: DataTypes.UUID },
};

export const VerificationTokenAttributes = {
  token: { type: DataTypes.STRING, primaryKey: true },
  identifier: { type: DataTypes.STRING, allowNull: false },
  expires: { type: DataTypes.DATE, allowNull: false },
};

// @see https://sequelize.org/master/manual/typescript.html
interface AccountInstance
  extends Model<AdapterAccount, Partial<AdapterAccount>>,
    AdapterAccount {}
interface UserInstance
  extends Model<AdapterUser, Partial<AdapterUser>>,
    AdapterUser {}
interface SessionInstance
  extends Model<AdapterSession, Partial<AdapterSession>>,
    AdapterSession {}
interface VerificationTokenInstance
  extends Model<VerificationToken, Partial<VerificationToken>>,
    VerificationToken {}

export function getNextAuthAdapterAndModels(sequelize: Sequelize): {
  nextAuthAdapter: Adapter;
  nextAuthModels: { User: ModelStatic<UserInstance> };
} {
  const modelOptions = { underscored: true, timestamps: false };
  const User = sequelize.define<UserInstance>(
    "user",
    UserAttributes,
    modelOptions
  );
  const Account = sequelize.define<AccountInstance>(
    "account",
    AccountAttributes,
    modelOptions
  );
  const Session = sequelize.define<SessionInstance>(
    "session",
    SessionAttributes,
    modelOptions
  );
  const VerificationToken = sequelize.define<VerificationTokenInstance>(
    "verificationToken",
    VerificationTokenAttributes,
    modelOptions
  );

  Account.belongsTo(User, { onDelete: "cascade" });
  Session.belongsTo(User, { onDelete: "cascade" });

  const nextAuthAdapter: Adapter = {
    async createUser(user): Promise<UserInstance> {
      return await User.create(user);
    },
    async getUser(id): Promise<AdapterUser | null> {
      const userInstance = await User.findByPk(id);

      return userInstance?.get({ plain: true }) ?? null;
    },
    async getUserByEmail(email): Promise<AdapterUser | null> {
      const userInstance = await User.findOne({
        where: { email },
      });

      return userInstance?.get({ plain: true }) ?? null;
    },
    async getUserByAccount({
      provider,
      providerAccountId,
    }): Promise<AdapterUser | null> {
      const accountInstance = await Account.findOne({
        where: { provider, providerAccountId },
      });

      if (!accountInstance) {
        return null;
      }

      const userInstance = await User.findByPk(accountInstance.userId);

      return userInstance?.get({ plain: true }) ?? null;
    },
    async updateUser(user): Promise<UserInstance> {
      await User.update(user, { where: { id: user.id } });
      const userInstance = await User.findByPk(user.id);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return userInstance!;
    },
    async deleteUser(userId): Promise<UserInstance | null> {
      const userInstance = await User.findByPk(userId);

      await User.destroy({ where: { id: userId } });

      return userInstance;
    },
    async linkAccount(account): Promise<void> {
      await Account.create(account);
    },
    async unlinkAccount({ provider, providerAccountId }): Promise<void> {
      await Account.destroy({
        where: { provider, providerAccountId },
      });
    },
    async createSession(session): Promise<SessionInstance> {
      return await Session.create(session);
    },
    async getSessionAndUser(sessionToken): Promise<{
      session: AdapterSession;
      user: AdapterUser;
    } | null> {
      const sessionInstance = await Session.findOne({
        where: { sessionToken },
      });

      if (!sessionInstance) {
        return null;
      }

      const userInstance = await User.findByPk(sessionInstance.userId);

      if (!userInstance) {
        return null;
      }

      return {
        session: sessionInstance?.get({ plain: true }),
        user: userInstance?.get({ plain: true }),
      };
    },
    async updateSession({
      sessionToken,
      expires,
    }): Promise<SessionInstance | null> {
      await Session.update(
        { expires, sessionToken },
        { where: { sessionToken } }
      );

      return await Session.findOne({ where: { sessionToken } });
    },
    async deleteSession(sessionToken): Promise<void> {
      await Session.destroy({ where: { sessionToken } });
    },
    async createVerificationToken(token): Promise<VerificationTokenInstance> {
      return await VerificationToken.create(token);
    },
    async useVerificationToken({
      identifier,
      token,
    }): Promise<VerificationToken | null> {
      const tokenInstance = await VerificationToken.findOne({
        where: { identifier, token },
      });

      await VerificationToken.destroy({ where: { identifier } });

      return tokenInstance?.get({ plain: true }) ?? null;
    },
  };

  return { nextAuthAdapter, nextAuthModels: { User } };
}
