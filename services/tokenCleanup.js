import Token from "../models/Token.js";
import { Op } from "sequelize";

// Function to delete expired tokens
export const deleteExpiredTokens = async () => {
  try {
    // Find and delete expired tokens from the database
    const token = await Token.destroy({
      where: { expiry: { [Op.lt]: new Date() } },
    });
    if (!token) {
      return; //console.log("No expired token to delete");
    }
    return; //console.log("Expired tokens deleted successfully");
  } catch (error) {
    console.error("Error deleting expired tokens:", error);
  }
};

// Schedule the cleanup task to run every 30 minutes
export const scheduleCleanupTask = () => {
  // Set up a recurring job to run every 15 minutes
  setInterval(deleteExpiredTokens, 15 * 60 * 1000);
};
