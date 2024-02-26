import { DataTypes } from "sequelize";
import sequelize from "../services/db.js";

// Define the token model
const Token = sequelize.define("Token", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiry: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default Token;
