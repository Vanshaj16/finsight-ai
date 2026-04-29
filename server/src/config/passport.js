import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import env from "./env.js";
import User from "../models/User.js";

const configurePassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select("-password");
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  if (!env.googleClientId || !env.googleClientSecret || !env.googleCallbackUrl) {
    return passport;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: env.googleCallbackUrl,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(new Error("Google account did not provide an email address."));
          }

          const user = await User.findOneAndUpdate(
            { email },
            {
              name: profile.displayName || email.split("@")[0],
              email,
              googleId: profile.id,
              profilePic: profile.photos?.[0]?.value || "",
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );

          done(null, user);
        } catch (error) {
          done(error);
        }
      },
    ),
  );

  return passport;
};

export default configurePassport;
