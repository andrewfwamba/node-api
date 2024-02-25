import passport from "passport";
import User from "../models/User.js";
import generateToken from "../services/Tokengen.js";
import { generateRandomPassword } from "../services/Passgen.js";

class AuthController {
  static googleAuthRedirect(req, res) {
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res);
  }

  static googleAuthCallback(req, res) {
    passport.authenticate(
      "google",
      { session: false },
      async (err, user, info) => {
        if (err || !user) {
          return res.status(401).json({ message: "Authentication failed" });
        }

        try {
          const { displayName, emails } = user;
          //   console.log(emails[0].value);
          const email = emails[0].value;

          let existingUser = await User.findOne({ where: { email } });

          if (!existingUser) {
            existingUser = await User.create({
              username: displayName,
              email,
              password: generateRandomPassword(), //"wyqfuyfufihiirihinghiwuefg",
            });
          }

          // Generate JWT token using the user ID
          const token = generateToken(existingUser.id);

          //   return res.json({ token });
          return res.redirect(`http://localhost:3000/callback?token=${token}`);
        } catch (error) {
          return res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
        }
      }
    )(req, res);
  }
}

export default AuthController;
