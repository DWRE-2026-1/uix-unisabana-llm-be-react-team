import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    model: { type: Schema.Types.ObjectId, ref: "LlmModel", default: null },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const Conversation = model("Conversation", conversationSchema);
