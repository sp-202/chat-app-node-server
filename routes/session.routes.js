// routes/session.routes.js
import { Router } from "express";
import sessionController from "../controllers/session.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// // All session routes require authentication
// router.get("/", authMiddleware, sessionController.getSessions);
// router.get("/:sessionId", authMiddleware, sessionController.getSession);
// router.delete("/:sessionId", authMiddleware, sessionController.deleteSession);
// router.put("/renew/:sessionId", authMiddleware, sessionController.renewSession);


router.get("/", authMiddleware, sessionController.getSessions);
router.get("/:sessionId", authMiddleware, sessionController.getSession);
router.delete("/:sessionId", authMiddleware, sessionController.deleteSession);
router.put("/renew", sessionController.renewSession);

export default router;
