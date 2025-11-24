// services/session.service.js
import SessionModel from "../models/session.model.js";
import UserModel from "../models/user.model.js";
import DeviceHelper from "../utils/device.details.js";
import jwtHelper from "../utils/jwt.utils.js";
import { randomBytes } from "crypto";

class SessionService {
    // Create and store a session
    async createSession(user, sessionToken, req) {
        // if (!user) throw new Error("User not found");
        console.log("session creation...")

        const deviceDetails = DeviceHelper.getClientDetails(req)
        console.log(deviceDetails)

        // Enforce Single Session: Delete all previous sessions for this user
        await SessionModel.deleteMany({ userId: user._id });

        const session = await SessionModel.create({
            userId: user._id,
            username: user.username,
            sessionToken: sessionToken,
            expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours

            deviceDetails: {
                deviceType: deviceDetails.deviceType,
                browser: deviceDetails.browser,
                os: deviceDetails.os,
                userAgent: deviceDetails.userAgent,
                ipAddress: deviceDetails.ip
            }
        });

        return session;
    }

    // List all sessions of a user
    async getUserSessions(userId) {
        return await SessionModel.find({ userId });
    }

    // Fetch a specific session
    async getSession(sessionId) {
        return SessionModel.findOne({ sessionId });  // ✔ correct field
    }

    // Delete session (Logout)
    async deleteSession(sessionId) {
        return await SessionModel.findByIdAndDelete(sessionId);
    }

    // Regenerate session token
    // Regenerate session token
    async renewSession(refreshToken) {
        const session = await SessionModel.findOne({ refreshToken });
        if (!session) throw new Error("Session not found or invalid refresh token");

        // Check if refresh token is expired
        if (new Date() > session.refreshTokenExpiry) {
            await this.deleteSession(session.sessionId);
            throw new Error("Refresh token expired. Please login again.");
        }

        const user = await UserModel.findById(session.userId);
        if (!user) throw new Error("User not found");

        // Generate new tokens
        session.sessionToken = jwtHelper.generateSessionToken(user);
        session.expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours

        // Rotate Refresh Token
        session.refreshToken = randomBytes(32).toString("hex");
        session.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await session.save();
        return session;
    }
}

export default new SessionService();
