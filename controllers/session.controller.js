// controllers/session.controller.js
import sessionService from "../services/session.service.js";

class SessionController {
  async getSessions(req, res) {
    try {
      const sessions = await sessionService.getUserSessions(req.user._id);
      return res.status(200).json({ success: true, sessions });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async getSession(req, res) {
    try {
      const session = await sessionService.getSession(req.params.sessionId);
      if (!session)
        return res.status(404).json({ success: false, message: "Session not found" });

      return res.status(200).json({ success: true, session });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async deleteSession(req, res) {
    try {
      const session = await sessionService.deleteSession(req.params.sessionId);
      if (!session)
        return res.status(404).json({ success: false, message: "Session not found" });

      return res.status(200).json({ success: true, message: "Session deleted" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async renewSession(req, res) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) return res.status(401).json({ success: false, message: "No refresh token provided" });

      const session = await sessionService.renewSession(refreshToken);

      // Update Session Token Cookie
      res.cookie("sessionToken", session.sessionToken, {
        httpOnly: true,
        secure: true,
        maxAge: 12 * 60 * 60 * 1000,
        sameSite: "strict"
      });

      // Update Refresh Token Cookie
      res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "strict"
      });

      return res.status(200).json({
        success: true,
        message: "Session renewed",
        expiresAt: session.expiresAt,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new SessionController();
