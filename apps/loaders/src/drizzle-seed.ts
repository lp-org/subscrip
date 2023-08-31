import { AwilixContainer } from "awilix";
import { PgJsDatabaseType, currency, user } from "db";
import { eq } from "drizzle-orm";
import { CurrencyType, currencies } from "server";
import UserService from "server/src/services/UserService";
import { Logger } from "winston";

export async function registerSeeder(defaultContainer: AwilixContainer) {
  const db: PgJsDatabaseType = defaultContainer.resolve("db");
  const logger: Logger = defaultContainer.resolve("logger");
  const userService: UserService = defaultContainer.resolve("userService");
  const email = "admin@example.com";
  const password = "12345";

  const exist = await db.select().from(user).where(eq(user.email, email));
  if (!exist[0]) {
    await userService.create({ email, password }, password);
    logger.info("Seed Users");
  }

  const currencyList = await db.select().from(currency);
  const currencyData: CurrencyType[] = [];
  for (const [key, value] of Object.entries(currencies)) {
    currencyData.push(value);
  }
  if (currencyList.length == 0) {
    await db.insert(currency).values(currencyData);
    logger.info("Seed Currencies");
  }
}
