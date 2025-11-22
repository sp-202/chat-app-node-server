// services/session.service.js
import SessionModel from "../models/session.model.js";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

class SessionService {
    // Create and store a session

    // Generate Session Token (12h)
    generateSessionToken(user) {
        return jwt.sign(
            {
                userId: user._id,
                username: user.username
            },
            process.env.JWT_SESSION_SECRET,
            { expiresIn: "12h" }
        );
    }

    async createSession(user, deviceType, ipAddress) {
        // if (!user) throw new Error("User not found");

        const sessionToken = this.generateSessionToken(user); // includes userId + username
        const refreshToken = crypto.randomUUID(); // simple UUID

        const session = await SessionModel.create({
            userId: user._id,
            username: user.username,
            password: user.password, // as per your requirement
            deviceType,
            ipAddress,
            sessionToken,
            refreshToken,
            expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours validity
        });

        return session;
    }

    // List all sessions of a user
    async getUserSessions(userId) {
        return await SessionModel.find({ userId });
    }

    // Fetch a specific session
    async getSession(sessionId) {
        return await SessionModel.findById(sessionId);
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
