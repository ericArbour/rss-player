"use strict";

// Changes were made to this file from the cli generated version
// to account for variations in environment pathnames due to next
// owning the running process.
// https://stackoverflow.com/questions/72419160/nextjs-and-sequelize-cannot-import-models
// https://stackoverflow.com/questions/66682892/i-am-trying-to-use-sequelize-with-next-js-api-routes/73132197#73132197

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const modelsPath = process.cwd() + "/db/models/";
const basename = path.basename(__dirname + "/../models/index.js");

fs.readdirSync(modelsPath)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(__dirname + "/../models/" + file)(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
