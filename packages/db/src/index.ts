import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
export { connectDatabase } from "./connect";

export * from "./schema";
export * from "./types/table-type";
export type PgJsDatabaseType = PostgresJsDatabase<typeof schema>;

export type SchemaType = typeof schema;
