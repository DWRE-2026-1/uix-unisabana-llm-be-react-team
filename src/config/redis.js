import { createClient } from "redis";
import { env } from "./env.js";

export const redis = createClient({
  url: env.REDIS_URL
});

redis.on("error", (error) => {
  // Keep this logger lightweight for bootstrap stage.
  console.error("Redis error:", error.message);
});

let isConnected = false;

export async function ensureRedisConnection() {
  if (!isConnected) {
    await redis.connect();
    isConnected = true;
  }
}
