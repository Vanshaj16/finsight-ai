import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";
import httpError from "../utils/httpError.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(25)
    .lean();

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  res.status(200).json({ notifications, unreadCount });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isRead: true },
    { new: true },
  ).lean();

  if (!notification) {
    throw httpError(404, "Notification not found.");
  }

  res.status(200).json({ notification });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json({ message: "All notifications marked as read." });
});
