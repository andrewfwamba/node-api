import express from "express";
import {
  createUser,
  getAllUsers,
  getUser,
  signInUser,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authorization/userAuth.js";
import {
  validateSignup,
  userValidation,
} from "../middlewares/validation/validation.js";

const router = express.Router();

router.post("/signup", validateSignup, userValidation, createUser);
router.post("/signin", validateUserSignIn, userValidation, signInUser);
// Authorize route
router.get("/users", isAuth, getAllUsers);
router.get("/userdetails", isAuth, getUser);

export default router;
