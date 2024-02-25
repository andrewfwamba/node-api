import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  // Generate JWT token using the user ID
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Set the token expiry time as desired
  });
  return token;
};

export default generateToken;
