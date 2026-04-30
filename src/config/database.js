import { mongoose } from "../database/connection.js";

export async function checkDatabaseHealth() {
  await mongoose.connection.db.admin().ping();
  return true;
}
