import { Schema, model } from "mongoose";

const llmProviderSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    baseUrl: { type: String, required: true },
    apiKeyEnvName: { type: String, default: null },
    isLocal: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const LlmProvider = model("LlmProvider", llmProviderSchema);
