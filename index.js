import express from "express";
import userRoutes from "./routes/users.js";
import db from "./services/db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Synchronize Sequelize models with the database
db.sync()
  .then(() => {
    console.log("Database synchronized.");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });

app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
