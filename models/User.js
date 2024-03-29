import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../services/db.js";

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
      },
      beforeSave: async (user) => {
        const saltRounds = 10;
        // Check if the password has been modified
        if (user.changed("password")) {
          // Hash the new password
          const hashedPassword = await bcrypt.hash(user.password, saltRounds);
          // Set the hashed password as the new value
          user.password = hashedPassword;
        }
      },
    },
  }
);

User.prototype.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default User;
