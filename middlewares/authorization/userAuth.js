import jwt from "jsonwebtoken";
import User from "../../models/User.js";

export const isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded.id);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.json({ success: false, message: "Unauthorized access" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.json({ success: false, message: "Invalid Access token" });
      }
      if (error.name === "TokenExpiredError") {
        return res.json({
          success: false,
          message: "Session expired try sign in",
        });
      }

      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else {
    res.json({ success: false, message: "Unauthorized access" });
  }
};
