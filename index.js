// app.js
import express from "express";
import userRoutes from "./routes/users.js";
import db from "./services/db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000

app.use(express.json());
// Synchronize Sequelize models with the database
db.sync()
  .then(() => {
    console.log("Database synchronized.");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });

// Use user routes
app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
