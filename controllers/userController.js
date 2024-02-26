import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Token from "../models/Token.js";
import ejs from "ejs";
import fs from "fs";
import nodemailer from "nodemailer";
import transporter from "../services/mailer.js";

// Read the email template file
const sigupTemplate = fs.readFileSync(
  "./views/emails/signup_email.ejs",
  "utf8"
);

export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create the user
    const newUser = await User.create({ username, email, password });
    // Render the email template with user data
    // const renderedEmail = ejs.render(sigupTemplate, {
    //   username: req.body.username,
    // });
    // Send the email
    // await transporter.sendMail({
    //   from: "your_email@example.com",
    //   to: req.body.email,
    //   subject: "Welcome to our platform!",
    //   html: renderedEmail,
    // });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    // Check if the password is valid
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    let newUser = [
      {
        username: user.username,
        email: user.email,
      },
    ];

    res.json({
      success: true,
      message: "Sign in successful",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["username", "email", "createdAt"],
    });
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { user } = req;
    const userdetails = await User.findByPk(user.id, {
      attributes: ["username", "email", "createdAt"],
    });
    res.json({ success: true, userdetails });
  } catch (error) {
    console.error("Error fetching userdetails", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const initiatePasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if uer exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User with provided email doesn't exist",
      });
    }
    const existingToken = await Token.findOne({ where: { email } });
    if (existingToken) {
      console.log("Token deleted");
      await Token.destroy({ where: { email } });
    }

    // Generate a six-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store the OTP securely (e.g., in the database)
    // You may want to associate it with the user's email or ID
    const expiryTime = new Date(Date.now() + 30 * 60 * 1000); // Current time + 30 minutes
    await Token.create({ email: user.email, token: otp, expiry: expiryTime });
    // const mailOptions = {
    //   from: "your@example.com",
    //   to: email,
    //   subject: "Password Reset OTP",
    //   text: `Your OTP for password reset is: ${otp}`,
    // };

    // await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ message: "Password reset OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const confirmPasswordReset = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    // Retrieve the OTP associated with the email from the database
    const token = await Token.findOne({
      where: {
        email,
        token: otp,
        // expiry: { [Sequelize.Op.gt]: new Date() }, // Expiry time should be greater than current time
      },
    });
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid reset token" });
    }
    if (token.expiry < new Date()) {
      // Delete token
      await Token.destroy({ where: { token: otp } });
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // user.password = newPassword;
    user.password = password;
    await user.save();
    await Token.destroy({ where: { token: otp } });
    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
