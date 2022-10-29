"use strict";

const usersTableName = "users";
const accountsTableName = "accounts";
const sessionsTableName = "sessions";
const verificationTokensTableName = "verification_tokens";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    // Create tables
    await queryInterface.createTable(usersTableName, {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      email_verified: { type: DataTypes.DATE },
      image: { type: DataTypes.STRING },
    });

    await queryInterface.createTable(accountsTableName, {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: { type: DataTypes.STRING, allowNull: false },
      provider: { type: DataTypes.STRING, allowNull: false },
      provider_account_id: { type: DataTypes.STRING, allowNull: false },
      refresh_token: { type: DataTypes.STRING },
      access_token: { type: DataTypes.STRING },
      expires_at: { type: DataTypes.INTEGER },
      token_type: { type: DataTypes.STRING },
      scope: { type: DataTypes.STRING },
      id_token: { type: DataTypes.STRING },
      session_state: { type: DataTypes.STRING },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: usersTableName,
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    await queryInterface.createTable(sessionsTableName, {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      expires: { type: DataTypes.DATE, allowNull: false },
      session_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: usersTableName,
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    await queryInterface.createTable(verificationTokensTableName, {
      token: { type: DataTypes.STRING, primaryKey: true },
      identifier: { type: DataTypes.STRING, allowNull: false },
      expires: { type: DataTypes.DATE, allowNull: false },
    });

    // Add unique constraints
    await queryInterface.addConstraint(usersTableName, {
      fields: ["email"],
      type: "unique",
      name: "users_email_key",
    });
    await queryInterface.addConstraint(sessionsTableName, {
      fields: ["session_token"],
      type: "unique",
      name: "sessions_session_token_key",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(verificationTokensTableName);
    await queryInterface.dropTable(accountsTableName);
    await queryInterface.dropTable(sessionsTableName);
    await queryInterface.dropTable(usersTableName);
  },
};
