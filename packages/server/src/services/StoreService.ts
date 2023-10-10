import {
  PgJsDatabaseType,
  plan,
  setting,
  store,
  storeSite,
  storeSubscriptionPlan,
  storeToUser,
} from "db";
import { RESOLVER } from "awilix";
import {
  InferModel,
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  sql,
} from "drizzle-orm";
import PaymentGatewayService from "./PaymentGatewayService";
import UserService from "./UserService";
import { string, z } from "zod";
import { CurrentStore } from "../types";
import { groupBy, values } from "lodash";
import dayjs from "dayjs";
import {
  updateStoreSettingDTO,
  updateStoreSettingDTOType,
  updateStoreSiteDTO,
  updateStoreSiteType,
} from "utils-data";

type InjectedDependencies = {
  db: PgJsDatabaseType;
  currentUser: Express.User;
  currentStore: CurrentStore;
  paymentGatewayService: PaymentGatewayService;
  userService: UserService;
};

type UpdateStore = InferModel<typeof store, "insert">;

export default class StoreService {
  static [RESOLVER] = {};
  protected readonly db_: PgJsDatabaseType;
  protected readonly currentUser_: Express.User;
  protected readonly paymentGatewayService_: PaymentGatewayService;
  protected readonly userService_: UserService;
  protected readonly currentStore_: CurrentStore;

  constructor({
    db,
    currentUser,
    paymentGatewayService,
    userService,
    currentStore,
  }: InjectedDependencies) {
    this.db_ = db;
    this.currentUser_ = currentUser;
    this.paymentGatewayService_ = paymentGatewayService;
    this.userService_ = userService;
    this.currentStore_ = currentStore;
  }

  async list() {
    const { ...rest } = getTableColumns(store);
    const { ...restStoreSubscriptionPlan } = getTableColumns(
      storeSubscriptionPlan
    );
    return await this.db_.transaction(async (tx) => {
      const storeUser = await tx
        .select({ ...rest, name: setting.name })
        .from(store)
        .innerJoin(storeToUser, eq(storeToUser.storeId, store.id))
        .innerJoin(setting, eq(setting.storeId, store.id))

        .where(eq(storeToUser.userId, this.currentUser_.userId!));

      return storeUser;
    });
  }
  async get(storeId: string) {
    return await this.db_.transaction(async (tx) => {
      const storeUser = await tx
        .select({
          name: setting.name,
          storeId: store.id,
          storeUserId: storeToUser.id,
          plan: plan.key,
          planStatus: storeSubscriptionPlan.status,
        })
        .from(store)
        .innerJoin(storeToUser, eq(storeToUser.storeId, store.id))
        .leftJoin(
          storeSubscriptionPlan,
          eq(storeToUser.storeId, storeSubscriptionPlan.id)
        )
        .leftJoin(plan, eq(storeSubscriptionPlan.planId, plan.id))
        .where(
          and(
            eq(storeToUser.userId, this.currentUser_.userId!),
            eq(storeToUser.storeId, storeId)
          )
        );
      return storeUser[0];
    });
  }

  async getStoreSetting(storeId: string) {
    return await this.db_.transaction(async (tx) => {
      const storeSetting = await tx
        .select({
          id: store.id,
          name: setting.name,
          currency: setting.currency,
          email: setting.email,
          phone: setting.phone,
          address: setting.address,
          facebook: setting.facebook,
          instagram: setting.instagram,
          favicon: setting.favicon,
          logo: setting.logo,
          ogimage: setting.ogimage,
          url: storeSite.url,
          createdAt: store.createdAt,
        })
        .from(store)
        .leftJoin(setting, eq(setting.storeId, store.id))
        .leftJoin(storeSite, eq(storeSite.storeId, store.id))
        .where(and(eq(store.id, storeId)));
      return storeSetting[0];
    });
  }

  async updateStoreSetting(
    storeId: string,
    payload: updateStoreSettingDTOType
  ) {
    return await this.db_.transaction(async (tx) => {
      const validated = updateStoreSettingDTO.parse(payload);
      const { ...validatedRest } = validated;

      const storeSetting = await tx
        .insert(setting)
        .values({
          ...validatedRest,
          storeId: storeId,
        })
        .onConflictDoUpdate({
          target: [setting.storeId],
          set: {
            ...validatedRest,
            storeId: storeId,
            updatedAt: new Date(),
          },
        })
        .returning();
      console.log(validatedRest);
      return storeSetting[0];
    });
  }

  async updateStoreSite(storeId: string, payload: updateStoreSiteType) {
    return await this.db_.transaction(async (tx) => {
      const validated = updateStoreSiteDTO.parse(payload);
      return await tx
        .update(storeSite)
        .set({ ...validated })
        .returning();
    });
  }

  async create(name: string) {
    return await this.db_.transaction(async (tx) => {
      const starterPlan = await tx.query.plan.findFirst({
        where: eq(plan.key, "starter"),
      });

      const user = await this.userService_.get(this.currentUser_.userId);
      if (!user || !user.sCustomerId) {
        throw new Error("User or customerId not found");
      }
      if (!starterPlan || !starterPlan.sPlanId) {
        throw new Error("No plan found");
      }
      const subscription = await this.paymentGatewayService_.createSubscription(
        user.sCustomerId,
        starterPlan.sPlanId,
        true
      );

      const newStore = await tx.insert(store).values({}).returning({
        id: store.id,
      });

      await tx.insert(setting).values({ name, storeId: newStore[0].id });

      await tx.insert(storeSite).values({
        url: `${name
          .replace(/\s+/g, "-")
          .trim()
          .toLocaleLowerCase()}-${dayjs().unix()}`,
        storeId: newStore[0].id,
      });

      await tx.insert(storeSubscriptionPlan).values({
        planId: starterPlan.id,
        currency: starterPlan.currency,
        price: starterPlan.price,
        storeId: newStore[0].id,
        sSubscriptionId: subscription.id,
      });

      const storeUser = await tx
        .insert(storeToUser)
        .values({
          storeId: newStore[0].id,
          userId: this.currentUser_.userId!,
        })
        .returning({
          id: storeToUser.storeId,
          storeUserId: storeToUser.id,
        });

      //
      return storeUser[0];
    });
  }

  async update(payload: UpdateStore) {
    const data = await this.db_.insert(store).values({
      active: payload.active,
      updatedAt: new Date(),
    });

    return data[0];
  }

  async retrieveByUrl(url: string) {
    const columns = getTableColumns(store);
    const storeData = await this.db_
      .select({ ...columns })
      .from(store)
      .leftJoin(storeSite, eq(storeSite.storeId, store.id))
      .where(eq(storeSite.url, url));

    return storeData[0] || null;
  }
}
