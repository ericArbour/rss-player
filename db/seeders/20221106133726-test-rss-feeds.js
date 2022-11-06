"use strict";
const { v4: uuidv4 } = require("uuid");

const rssFeedsTableName = "rss_feeds";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [users] = await queryInterface.sequelize.query(
      `select id from users where email = 'test@test.com';`
    );

    await queryInterface.bulkInsert(rssFeedsTableName, [
      {
        id: uuidv4(),
        url: "https://changelog.com/jsparty/feed",
        user_id: users[0].id,
      },
    ]);

    await queryInterface.bulkInsert(rssFeedsTableName, [
      {
        id: uuidv4(),
        url: "https://changelog.com/podcast/feed",
        user_id: users[0].id,
      },
    ]);

    return queryInterface.bulkInsert(rssFeedsTableName, [
      {
        id: uuidv4(),
        url: "https://changelog.com/gotime/feed",
        user_id: users[0].id,
      },
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete(rssFeedsTableName, null);
  },
};
