import dotenv from "dotenv";

dotenv.config();

const mongoHost = process.env.MONGO_HOST || "mongodb";
const mongoPort = Number(process.env.MONGO_PORT || 27017);
const mongoDatabase = process.env.MONGO_DATABASE || "uix_db";
const mongoUsername = process.env.MONGO_USERNAME || "uix_user";
const mongoPassword = process.env.MONGO_PASSWORD || "uix_password";
const mongoAuthSource = process.env.MONGO_AUTH_SOURCE || "admin";
const mongoUri =
  process.env.MONGO_URI ||
  `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}?authSource=${mongoAuthSource}`;

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_PORT: Number(process.env.APP_PORT || 4000),
  MONGO_HOST: mongoHost,
  MONGO_PORT: mongoPort,
  MONGO_DATABASE: mongoDatabase,
  MONGO_USERNAME: mongoUsername,
  MONGO_PASSWORD: mongoPassword,
  MONGO_AUTH_SOURCE: mongoAuthSource,
  MONGO_URI: mongoUri,
  mongoUri,
  REDIS_URL:
    process.env.REDIS_URL ||
    `redis://:${process.env.REDIS_PASSWORD || "change_me_redis"}@redis:${process.env.REDIS_PORT_CONTAINER || 6379}`,
  LLM_DEFAULT_PROVIDER: process.env.LLM_DEFAULT_PROVIDER || "ollama",
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o-mini",
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || "http://host.docker.internal:11434",
  OLLAMA_OPENAI_BASE_URL:
    process.env.OLLAMA_OPENAI_BASE_URL || "http://host.docker.internal:11434/v1",
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || "llama3.1"
};
