import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt;
        if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

        // 1. Decode without verification to get userId
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Unauthorized: Invalid token structure" });
        }

        // 2. Fetch user to get password hash
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(401).json({ message: "Unauthorized: User not found" });

        // 3. Construct dynamic secret
        const dynamicSecret = process.env.JWT_SECRET + user.password;

        // 4. Verify token with dynamic secret
        jwt.verify(token, dynamicSecret);

        // 5. Attach user to request
        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export default authMiddleware;
