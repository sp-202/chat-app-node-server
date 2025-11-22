import User from "../models/user.model.js";

class UserService {
    async createUser(data) {
        const user = new User(data);
        return await user.save();
    }

    async getUserById(id) {
        return await User.findById(id);
    }

    async getAllUsers() {
        return await User.find();
    }

    async updateUser(id, data) {
        return await User.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }
}

const userService = new UserService();
export default userService;
