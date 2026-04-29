import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

export default mongoose.model("User", userSchema);
