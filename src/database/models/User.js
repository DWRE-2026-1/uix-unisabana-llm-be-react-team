import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: "Role", default: null },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
