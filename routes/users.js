// routes/users.js
import express from "express";
import {
  createUser,
  getAllUsers,
  signInUser,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authorization/userAuth.js";

const router = express.Router();

// Create a new user
router.post("/signup", createUser);
router.post("/signin", signInUser);
router.get("/users", isAuth, getAllUsers);

// Add more routes as needed

export default router;
