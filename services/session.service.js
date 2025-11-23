// services/session.service.js
import SessionModel from "../models/session.model.js";
import UserModel from "../models/user.model.js";
import DeviceHelper from "../utils/device.details.js";

class SessionService {
    // Create and store a session
    async createSession(user, sessionToken, req) {
        // if (!user) throw new Error("User not found");
        console.log("session creation...")

        const deviceDetails = DeviceHelper.getClientDetails(req)
        console.log(deviceDetails)

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
    async renewSession(sessionId) {
        const session = await SessionModel.findById(sessionId);
        if (!session) throw new Error("Session not found");

        const user = await UserModel.findById(session.userId);
        if (!user) throw new Error("User not found");

        session.sessionToken = createSessionToken(user);
        session.expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);

        await session.save();
        return session;
    }
}

export default new SessionService();
