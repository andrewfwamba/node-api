import Sequelize from "sequelize";
import config from "../utilities/config.js";

const env = process.env.NODE_ENV || "development";
const { database, username, password, ...rest } = config[env];

const sequelize = new Sequelize(database, username, password, {
  ...rest,
  logging: false,
});

export default sequelize;
