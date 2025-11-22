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
      const session = await sessionService.renewSession(req.params.sessionId);

      res.cookie("session_token", session.sessionToken, {
        httpOnly: true,
        secure: true,
        maxAge: 12 * 60 * 60 * 1000,
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
