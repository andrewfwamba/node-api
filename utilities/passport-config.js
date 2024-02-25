import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

// Configure Passport.js with Google OAuth 2.0 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:8000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Use profile information or save user to database
      // This function is called after successful authentication
      return done(null, profile); // Pass the user object to the callback
    }
  )
);

export default passport;
