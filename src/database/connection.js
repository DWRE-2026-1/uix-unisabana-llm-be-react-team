import mongoose from "mongoose";
import { env } from "../config/env.js";

let hasConnected = false;

export async function connectDatabase() {
  if (hasConnected) return;

  try {
    await mongoose.connect(env.mongoUri, {
      dbName: env.MONGO_DATABASE,
      maxPoolSize: 20
    });
    hasConnected = true;
    console.log(`[db] Connected to MongoDB at ${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DATABASE}`);
  } catch (error) {
    console.error("[db] MongoDB connection failed:", error.message);
    throw error;
  }
}

mongoose.connection.on("error", (error) => {
  console.error("[db] MongoDB connection error:", error.message);
});

mongoose.connection.on("disconnected", () => {
  hasConnected = false;
  console.warn("[db] MongoDB disconnected");
});

export async function closeDatabaseConnection() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
}

export { mongoose };
