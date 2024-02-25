import express from "express";
import AuthController from "../controllers/OAuth.js";

const router = express.Router();

router.get("/auth/google", AuthController.googleAuthRedirect);
router.get("/auth/google/callback", AuthController.googleAuthCallback);

export default router;
