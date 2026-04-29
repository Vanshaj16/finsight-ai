import bcrypt from "bcryptjs";
import env from "../config/env.js";
import User from "../models/User.js";
import cookieOptions from "../utils/cookieOptions.js";
import { signToken } from "../services/tokenService.js";
import httpError from "../utils/httpError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { notifyProfileUpdated } from "../services/notificationService.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profilePic: user.profilePic,
  createdAt: user.createdAt,
});

const sendAuthResponse = (res, user, statusCode = 200) => {
  const token = signToken({ userId: user._id });
  res.cookie(env.cookieName, token, cookieOptions(env.isProduction));
  res.status(statusCode).json({ user: sanitizeUser(user) });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw httpError(409, "An account with that email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  sendAuthResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.password) {
    throw httpError(401, "Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw httpError(401, "Invalid email or password.");
  }

  sendAuthResponse(res, user);
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(env.cookieName, cookieOptions(env.isProduction));

  if (req.logout) {
    req.logout(() => {});
  }

  res.status(200).json({ message: "Logged out successfully." });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({ user: sanitizeUser(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw httpError(404, "User not found.");
  }

  const nextName = req.body.name?.trim();
  const nextEmail = req.body.email?.trim().toLowerCase();
  const nextProfilePic = req.body.profilePic?.trim() || "";

  if (nextEmail && nextEmail !== user.email) {
    const existingUser = await User.findOne({ email: nextEmail, _id: { $ne: user._id } });

    if (existingUser) {
      throw httpError(409, "Another account already uses that email.");
    }

    user.email = nextEmail;
  }

  if (nextName) {
    user.name = nextName;
  }

  user.profilePic = nextProfilePic;

  await user.save();
  await notifyProfileUpdated({ userId: user._id, name: user.name });

  res.status(200).json({
    message: "Profile updated successfully.",
    user: sanitizeUser(user),
  });
});

export const googleAuthUnavailable = (_req, res) => {
  res.status(503).json({
    message: "Google OAuth is not configured. Add Google OAuth credentials to enable it.",
  });
};

export const googleCallback = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw httpError(401, "Google authentication failed.");
  }

  const token = signToken({ userId: req.user._id });
  res.cookie(env.cookieName, token, cookieOptions(env.isProduction));
  res.redirect(`${env.clientUrl}/dashboard`);
});
