import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../database/models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role || "user" },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export const authService = {
  async login({ email, password }) {
    const user = await User.findOne({ email, deletedAt: null, isActive: true });
    if (!user) {
      throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
    }
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
    }
    user.lastLoginAt = new Date();
    await user.save();
    const token = signToken(user);
    return { token, user: { id: user._id, email: user.email, name: user.name } };
  },

  async register({ email, password, name }) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw Object.assign(new Error("Email already in use"), { statusCode: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name });
    const token = signToken(user);
    return { token, user: { id: user._id, email: user.email, name: user.name } };
  },

  async logout() {
    return { message: "Logged out successfully" };
  },

  async me(userId) {
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }
    return user;
  },

  async updateMe(userId, { name, password }) {
    const updates = {};
    if (name) updates.name = name;
    if (password) updates.passwordHash = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-passwordHash");
    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }
    return user;
  }
};