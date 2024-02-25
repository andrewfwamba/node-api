import { check, validationResult } from "express-validator";

export const validateSignup = [
  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("username is a mandatory field")
    .isString()
    .withMessage("invalid username"),
  // check email
  check("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email address"),
  // check password values
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must between 8 and 20 characters long"),
];

export const validateUserSignIn = [
  check("email").trim().isEmail().withMessage("email/password is required"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("email/password is required"),
];

export const userValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();
  const error = result[0].msg;
  res.json({ success: false, message: error });
};
