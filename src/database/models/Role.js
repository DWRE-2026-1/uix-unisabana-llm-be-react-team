import { Schema, model } from "mongoose";

const roleSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const Role = model("Role", roleSchema);
