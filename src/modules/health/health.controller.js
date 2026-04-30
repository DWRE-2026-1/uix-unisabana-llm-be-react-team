import { checkDatabaseHealth } from "../../config/database.js";
import { ensureRedisConnection, redis } from "../../config/redis.js";
import { env } from "../../config/env.js";

export async function getHealth(_req, res, next) {
  try {
    await checkDatabaseHealth();
    await ensureRedisConnection();
    await redis.ping();
    res.json({
      status: "ok",
      mongodb: "up",
      redis: "up",
      llm_default_provider: env.LLM_DEFAULT_PROVIDER
    });
  } catch (error) {
    next(error);
  }
}
