import userService from "../services/user.service.js";

class UserController {

    // =======================
    //  REGISTER USER
    // =======================
    async createUser(req, res) {
        try {
            const { user, token, session } = await userService.createUser({ ...req.body, req });

            // Send token in cookie
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: true,          // set true on production
                sameSite: "none",      // for cross-site cookies
                maxAge: 24 * 60 * 60 * 1000  // 24 hours
            });

            // session token
            res.cookie("sessionToken", user.sessionToken, {
                httpOnly: true,
                secure: true,
                maxAge: 12 * 60 * 60 * 1000,
                sameSite: "strict"
            });

            return res.status(201).json({
                message: "User created successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    bio: user.bio
                }
            });

        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }

    

    // =======================
    //  LOGIN USER
    // =======================
    async login(req, res) {
        try {
            const { identifier, password } = req.body;
            const { user, token, session } = await userService.login(identifier, password, req);

            // Send JWT in cookie
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 24 * 60 * 60 * 1000
            });

            // session token
            res.cookie("sessionToken", user.sessionToken, {
                httpOnly: true,
                secure: true,
                maxAge: 12 * 60 * 60 * 1000,
                sameSite: "strict"
            });

            return res.json({
                message: "Login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    bio: user.bio
                }
            });

        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }

    // =======================
    //  GET USER BY ID
    // =======================
    async getUser(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            if (!user) return res.status(404).json({ message: "User not found" });
            return res.json(user);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    // =======================
    //  GET ALL USERS
    // =======================
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    // =======================
    //  UPDATE USER
    // =======================
    async updateUser(req, res) {
        try {
            const user = await userService.updateUser(req.params.id, req.body);
            if (!user) return res.status(404).json({ message: "User not found" });
            return res.json(user);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }

    // =======================
    //  DELETE USER
    // =======================
    async deleteUser(req, res) {
        try {
            const result = await userService.deleteUser(req.params.id);
            if (!result) return res.status(404).json({ message: "User not found" });
            return res.json({ message: "User deleted" });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}

export default new UserController();
