import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle> | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const queryClient = postgres(connectionString);

export const db =
  globalForDb.db ?? drizzle(queryClient, { schema, casing: "snake_case" });

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
