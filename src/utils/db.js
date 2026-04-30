import { mongoose } from "../database/connection.js";

export async function query(text, params = []) {
  // This helper remains for compatibility. MongoDB does not support SQL queries.
  throw new Error(`SQL query helper is deprecated in MongoDB mode. Query: ${text}, params: ${params.length}`);
}

export async function transaction(callback) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
