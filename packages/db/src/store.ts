import { AwilixContainer } from "awilix";
import { eq, ne, and, sql, SQL, inArray } from "drizzle-orm";
import { PgJsDatabaseType } from ".";
import {
  store,
  storeToUser,
  plan,
  storeSubscriptionPlan,
  setting,
  storeSite,
} from "./schema";

export async function getCurrentStore(
  container: AwilixContainer,
  storeId: string,
  userId: string,
  storeFrontStoreId?: string
) {
  const db: PgJsDatabaseType = container.resolve("db");
  const condition: SQL[] = [];

  if (storeId && userId) {
    condition.push(
      eq(storeToUser.userId, userId),
      eq(storeToUser.storeId, storeId)
    );
  } else if (storeFrontStoreId) {
    condition.push(eq(store.id, storeFrontStoreId));
  } else {
    return undefined;
  }

  try {
    const currentStore = await db
      .select({
        storeId: store.id,
        name: setting.name,
        storeUserId: storeToUser.id,
        currency: setting.currency,
        planStatus: store.planStatus,
        plan: store.plan,
        url: storeSite.url,
      })
      .from(store)
      .innerJoin(storeToUser, eq(storeToUser.storeId, store.id))
      // .leftJoin(
      //   storeSubscriptionPlan,
      //   eq(storeToUser.storeId, storeSubscriptionPlan.storeId)
      // )
      .leftJoin(storeSite, eq(storeSite.storeId, store.id))
      .leftJoin(setting, eq(setting.storeId, store.id))
      .where(and(...condition));
    const result = currentStore[0];
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    result.url = `${protocol}://${result.url}${process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN}`;
    return result;
  } catch (error) {
    return undefined;
  }
}
