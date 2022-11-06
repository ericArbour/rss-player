"use strict";
const { v4: uuidv4 } = require("uuid");

const usersTableName = "users";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert(usersTableName, [
      {
        id: uuidv4(),
        email: "test@test.com",
      },
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete(usersTableName, null);
  },
};
