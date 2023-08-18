import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
export function connectDatabase(
  connectionString = process.env.DATABASE_URL ||
    "postgresql://postgres:12345678@localhost:5432/app"
) {
  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  return db;
}
