import mongoose from "mongoose";
import { randomBytes } from "crypto";

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    default: () => randomBytes(16).toString("hex"),
    unique: true
  },

  sessionToken: { type: String, required: true },
  refreshToken: {
    type: String,
    default: () => randomBytes(32).toString("hex")
  },

  deviceType: { type: String },
  ipAddress: { type: String },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  username: { type: String, required: true },

  expiresAt: { type: Date, required: true },
  refreshTokenExpiry: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Session", sessionSchema);