// db.js
import Sequelize from "sequelize";
import config from "../utilities/config.js";
// import config from "./config.js";

const env = process.env.NODE_ENV || "development";
const { database, username, password, ...rest } = config[env];

const sequelize = new Sequelize(database, username, password, {
  ...rest,
  logging: false, // Set to true to log SQL queries
});

export default sequelize;
