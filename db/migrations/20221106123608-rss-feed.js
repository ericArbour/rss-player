"use strict";

const rssFeedsTableName = "rss_feeds";
const usersTableName = "users";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    // Create tables
    await queryInterface.createTable(rssFeedsTableName, {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      url: { type: DataTypes.STRING, allowNull: false },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: usersTableName,
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    // Add unique constraints
    await queryInterface.addConstraint(rssFeedsTableName, {
      fields: ["url", "user_id"],
      type: "unique",
      name: "rss_feeds_url_user_id",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(rssFeedsTableName);
  },
};
