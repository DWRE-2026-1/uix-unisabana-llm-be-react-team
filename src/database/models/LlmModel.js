import { Schema, model } from "mongoose";

const llmModelSchema = new Schema(
  {
    provider: { type: Schema.Types.ObjectId, ref: "LlmProvider", required: true },
    name: { type: String, required: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    contextWindow: { type: Number, default: null },
    supportsStreaming: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

llmModelSchema.index({ provider: 1, name: 1 }, { unique: true });

export const LlmModel = model("LlmModel", llmModelSchema);
