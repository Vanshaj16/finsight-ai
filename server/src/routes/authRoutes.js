import { Router } from "express";
import passport from "passport";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  googleAuthUnavailable,
  googleCallback,
} from "../controllers/authController.js";
import { registerValidator, loginValidator } from "../validators/authValidators.js";
import env from "../config/env.js";

const router = Router();
const googleEnabled = Boolean(env.googleClientId && env.googleClientSecret && env.googleCallbackUrl);

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);
router.patch(
  "/profile",
  protect,
  body("name")
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters."),
  body("email").isEmail().withMessage("A valid email is required.").normalizeEmail(),
  body("profilePic")
    .optional({ values: "falsy" })
    .isURL({ require_protocol: true })
    .withMessage("Profile image must be a valid URL."),
  validate,
  updateProfile,
);

if (googleEnabled) {
  router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: `${env.clientUrl}/login?error=google` }),
    googleCallback,
  );
} else {
  router.get("/google", googleAuthUnavailable);
  router.get("/google/callback", googleAuthUnavailable);
}

export default router;
