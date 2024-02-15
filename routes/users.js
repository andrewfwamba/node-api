import express from "express";
import {
  createUser,
  getAllUsers,
  signInUser,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authorization/userAuth.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", signInUser);
// Authorize route
router.get("/users", isAuth, getAllUsers);

export default router;
