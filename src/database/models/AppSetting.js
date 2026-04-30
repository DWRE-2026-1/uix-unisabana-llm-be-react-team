import { Schema, model } from "mongoose";

const appSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: Schema.Types.Mixed, default: null },
    type: { type: String, default: "string" },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

export const AppSetting = model("AppSetting", appSettingSchema);
