import express from "express";
import {
  confirmPasswordReset,
  createUser,
  getAllUsers,
  getUser,
  initiatePasswordReset,
  signInUser,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authorization/userAuth.js";
import {
  validateSignup,
  userValidation,
  validateUserSignIn,
  initResetpassword,
  resetPassValidation,
} from "../middlewares/validation/validation.js";

const router = express.Router();

router.post("/signup", validateSignup, userValidation, createUser);
router.post("/signin", validateUserSignIn, userValidation, signInUser);
// Authorize route
router.get("/users", isAuth, getAllUsers);
router.get("/userdetails", isAuth, getUser);
// reset pass routes
router.post(
  "/reset-password",
  initResetpassword,
  userValidation,
  initiatePasswordReset
);
router.post(
  "/reset-password/confirm",
  resetPassValidation,
  userValidation,
  confirmPasswordReset
);

export default router;
