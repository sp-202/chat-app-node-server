import userService from "../services/user.service.js";

class UserController {
    async createUser(req, res) {
        try {
            const user = await userService.createUser(req.body);
            return res.status(201).json(user);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }

    async getUser(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            if (!user) return res.status(404).json({ message: "User not found" });
            return res.json(user);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    async updateUser(req, res) {
        try {
            const user = await userService.updateUser(req.params.id, req.body);
            if (!user) return res.status(404).json({ message: "User not found" });
            return res.json(user);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }

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
