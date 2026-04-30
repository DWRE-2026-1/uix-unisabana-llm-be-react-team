import bcrypt from "bcryptjs";
import { fileURLToPath } from "node:url";
import { connectDatabase, closeDatabaseConnection } from "../connection.js";
import { Permission } from "../models/Permission.js";
import { Role } from "../models/Role.js";
import { User } from "../models/User.js";
import { LlmProvider } from "../models/LlmProvider.js";
import { LlmModel } from "../models/LlmModel.js";
import { AppSetting } from "../models/AppSetting.js";
import { env } from "../../config/env.js";

const ADMIN_NAME = "Admin";
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "Admin123456!";

const PERMISSIONS = [
  { name: "Manage users", slug: "users.manage", description: "Create, update and remove users" },
  { name: "Manage roles", slug: "roles.manage", description: "Create and update roles" },
  { name: "Manage providers", slug: "providers.manage", description: "Update LLM provider settings" },
  { name: "Use chat", slug: "chat.use", description: "Create conversations and messages" }
];

export async function seedDatabase({ keepConnection = false } = {}) {
  try {
    await connectDatabase();

    const permissionIds = [];
    for (const permission of PERMISSIONS) {
      const doc = await Permission.findOneAndUpdate(
        { slug: permission.slug },
        { $set: permission },
        { upsert: true, new: true }
      );
      permissionIds.push(doc._id);
    }

    const adminRole = await Role.findOneAndUpdate(
      { slug: "admin" },
      {
        $set: {
          name: "Administrator",
          description: "System administrator with full platform access",
          permissions: permissionIds,
          deletedAt: null
        }
      },
      { upsert: true, new: true }
    );

    await Role.findOneAndUpdate(
      { slug: "user" },
      {
        $set: {
          name: "User",
          description: "Regular platform user",
          deletedAt: null
        }
      },
      { upsert: true, new: true }
    );

    const provider = await LlmProvider.findOneAndUpdate(
      { slug: "ollama" },
      {
        $set: {
          name: "Ollama Local",
          baseUrl: env.OLLAMA_BASE_URL,
          apiKeyEnvName: null,
          isLocal: true,
          isActive: true
        }
      },
      { upsert: true, new: true }
    );

    await LlmModel.updateMany({ provider: provider._id }, { $set: { isDefault: false } });
    await LlmModel.findOneAndUpdate(
      { provider: provider._id, name: env.OLLAMA_MODEL },
      {
        $set: {
          displayName: `Ollama ${env.OLLAMA_MODEL}`,
          contextWindow: 8192,
          supportsStreaming: true,
          isActive: true,
          isDefault: true
        }
      },
      { upsert: true, new: true }
    );

    await AppSetting.findOneAndUpdate(
      { key: "llm.default_provider" },
      {
        $set: {
          value: "ollama",
          type: "string",
          description: "Default LLM provider for chat requests"
        }
      },
      { upsert: true, new: true }
    );

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        $set: {
          name: ADMIN_NAME,
          role: adminRole._id,
          isActive: true,
          deletedAt: null
        },
        $setOnInsert: {
          passwordHash
        }
      },
      { upsert: true, new: true }
    );

    console.log("[seed] done");
    console.log("[seed] default admin for local development only:");
    console.log(`[seed] email: ${ADMIN_EMAIL}`);
    console.log(`[seed] password: ${ADMIN_PASSWORD}`);
  } catch (error) {
    console.error("[seed] failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (!keepConnection) {
      await closeDatabaseConnection();
    }
  }
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  seedDatabase();
}
