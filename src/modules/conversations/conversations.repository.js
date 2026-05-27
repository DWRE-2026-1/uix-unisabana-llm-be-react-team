import { Conversation } from "../../database/models/Conversation.js";

export const conversationsRepository = {
  async create(payload) {
    const conversation = new Conversation(payload);
    return conversation.save();
  },

  async listByUser(userId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Conversation.find({ user: userId, deletedAt: null })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Conversation.countDocuments({ user: userId, deletedAt: null })
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
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