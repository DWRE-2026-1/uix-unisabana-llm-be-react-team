import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    role: {
      type: String,
      enum: ["system", "user", "assistant", "tool"],
      required: true
    },
    content: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const Message = model("Message", messageSchema);
