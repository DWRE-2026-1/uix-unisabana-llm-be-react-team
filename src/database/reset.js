import { connectDatabase, closeDatabaseConnection } from "./connection.js";
import { Permission } from "./models/Permission.js";
import { Role } from "./models/Role.js";
import { User } from "./models/User.js";
import { Conversation } from "./models/Conversation.js";
import { Message } from "./models/Message.js";
import { LlmProvider } from "./models/LlmProvider.js";
import { LlmModel } from "./models/LlmModel.js";
import { AppSetting } from "./models/AppSetting.js";
import { seedDatabase } from "./seeders/seed.js";

async function run() {
  try {
    await connectDatabase();
    console.warn("[db:reset] WARNING: this command removes development data");

    await Promise.all([
      Message.deleteMany({}),
      Conversation.deleteMany({}),
      User.deleteMany({}),
      Role.deleteMany({}),
      Permission.deleteMany({}),
      LlmModel.deleteMany({}),
      LlmProvider.deleteMany({}),
      AppSetting.deleteMany({})
    ]);

    console.log("[db:reset] collections cleared");
    await seedDatabase({ keepConnection: true });
  } catch (error) {
    console.error("[db:reset] failed:", error.message);
    process.exitCode = 1;
  } finally {
    await closeDatabaseConnection();
  }
}

run();
