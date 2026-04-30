import { Schema, model } from "mongoose";

const permissionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Permission = model("Permission", permissionSchema);
