const Sequelize = require("sequelize");
const config = require("./config");
const sequelize = new Sequelize(
  config.db.DB_NAME,
  config.db.DB_USER,
  config.db.DB_PASS,
  {
    host: config.db.DB_HOST,
    dialect: config.db.DB_DIALECT,
  }
);

module.exports = sequelize;
