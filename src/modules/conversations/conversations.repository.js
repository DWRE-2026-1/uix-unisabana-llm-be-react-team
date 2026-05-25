import { Conversation } from "../../database/models/Conversation.js";

export const conversationsRepository = {
  async create(payload) {
    return Conversation.create(payload);
  },

  async listByUser(userId) {
    return Conversation.find({ user: userId, deletedAt: null }).sort({ createdAt: -1 });
  },

  async findById(id) {
    return Conversation.findOne({ _id: id, deletedAt: null });
  },

  async updateById(id, payload) {
    return Conversation.findByIdAndUpdate(id, payload, { new: true });
  },

  async deleteById(id) {
    return Conversation.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  }
};