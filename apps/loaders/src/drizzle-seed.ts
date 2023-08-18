import { user } from "db";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

async function seedDatabase() {
  const client = postgres(process.env.DATABASE_URL || "");
  const db = drizzle(client);

  const email = "admin@example.com";
  const password = "12345";

  const exist = await db.select().from(user).where(eq(user.email, email));
  if (!exist[0]) {
    await db.insert(user).values({ email, password }).returning();
  }

  process.exit();
}
seedDatabase();
