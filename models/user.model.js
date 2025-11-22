import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    username: { type: String, required: true, unique: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    bio: { type: String, default: "" },

    jwtToken: { type: String, default: "" },
    tokenExpiry: { type: Date },   // store token expiry timestamp

    sessionToken: { type: String },
    sessionTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

// ---  METHOD: Refresh token expiry (24 hours ahead)
userSchema.methods.refreshTokenExpiry = function () {
  const expiryTime = new Date();
  expiryTime.setHours(expiryTime.getHours() + 24); // +24 Hrs

  this.tokenExpiry = expiryTime;
};

// Refresh Session token expiry (24 hours ahead)
userSchema.methods.refreshSession = function () {
    this.sessionTokenExpiry = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours
};

const User = mongoose.model("User", userSchema);

export default User;
