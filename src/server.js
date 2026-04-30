import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { closeDatabaseConnection, connectDatabase } from "./database/connection.js";

async function bootstrap() {
  await connectDatabase();

  const server = app.listen(env.APP_PORT, () => {
    logger.info(`uix-app listening on port ${env.APP_PORT}`);
  });

  const shutdown = async () => {
    logger.info("Shutting down backend process");
    server.close(async () => {
      await closeDatabaseConnection();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((error) => {
  logger.error("Failed to start backend:", error.message);
  process.exit(1);
});
