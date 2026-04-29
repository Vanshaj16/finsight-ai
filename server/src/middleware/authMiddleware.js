import User from "../models/User.js";
import env from "../config/env.js";
import { verifyToken } from "../services/tokenService.js";
import httpError from "../utils/httpError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[env.cookieName];

  if (!token) {
    throw httpError(401, "Authentication required.");
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw httpError(401, "User no longer exists.");
  }

  req.user = user;
  next();
});
