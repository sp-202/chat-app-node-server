import User from "../models/user.model.js";
import SessionService from "../services/session.service.js";
import jwtHelper from "../utils/jwt.utils.js";
import bcrypt from "bcrypt";

class UserService {

  // Create New User
  async createUser(data) {
    const { name, username, email, password, bio, req } = data;

    const existing = await User.findOne({
      $or: [{ email }, { username }]
    });
    if (existing) throw new Error("Email or Username already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      bio
    });

    user.jwtToken = jwtHelper.generateToken(user);
    user.sessionToken = jwtHelper.generateSessionToken(user);

    user.refreshSession();
    user.refreshTokenExpiry();

    

    // create a session entry in DB
    console.log("user creation init..")
    const session = await SessionService.createSession(user, user.sessionToken, req);
    await user.save();
    
    return { user, token: user.jwtToken, session };
  }


  // Login
  async login(identifier, password, req) {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid password");

    user.jwtToken = jwtHelper.generateToken(user);
    user.sessionToken = jwtHelper.generateSessionToken(user);

    user.refreshSession();
    user.refreshTokenExpiry();
    await user.save();

    // create login session
    const session = await SessionService.createSession(user, user.sessionToken, req);

    return { user, token: user.jwtToken, session };
  }


  async getUserById(id) {
    return await User.findById(id).select("-password");
  }

  async getAllUsers() {
    return await User.find().select("-password");
  }

  async updateUser(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    let user = await User.findByIdAndUpdate(id, data, { new: true });
    if (!user) return null;

    user.jwtToken = jwtHelper.generateToken(user);
    user.sessionToken = jwtHelper.generateSessionToken(user);

    user.refreshSession();
    user.refreshTokenExpiry();

    const savedUser = await user.save();

    return savedUser;
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }
}

export default new UserService();
