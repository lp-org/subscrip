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
  url?: string
) {
  const db: PgJsDatabaseType = container.resolve("db");
  const condition: SQL[] = [];

  if (storeId && userId) {
    condition.push(
      eq(storeToUser.userId, userId),
      eq(storeToUser.storeId, storeId)
    );
  } else if (url) {
    condition.push(eq(storeSite.url, url));
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
      })
      .from(store)
      .innerJoin(storeToUser, eq(storeToUser.storeId, store.id))
      // .leftJoin(
      //   storeSubscriptionPlan,
      //   eq(storeToUser.storeId, storeSubscriptionPlan.storeId)
      // )
      // .leftJoin(plan, eq(storeSubscriptionPlan.planId, plan.id))
      .leftJoin(setting, eq(setting.storeId, store.id))
      .where(and(...condition));

    return currentStore[0];
  } catch (error) {
    return undefined;
  }
}
