import {
  PgJsDatabaseType,
  User,
  plan,
  store,
  storeSubscriptionPlan,
  storeToUser,
  user,
} from "db";
import { RESOLVER } from "awilix";
import { InferModel, and, eq } from "drizzle-orm";
import { CurrentStore } from "../types";
import PaymentGatewayService from "./PaymentGatewayService";
import UserService from "./UserService";
type InjectedDependencies = {
  db: PgJsDatabaseType;
  currentUser: Express.User;
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

  constructor({
    db,
    currentUser,
    paymentGatewayService,
    userService,
  }: InjectedDependencies) {
    this.db_ = db;
    this.currentUser_ = currentUser;
    this.paymentGatewayService_ = paymentGatewayService;
    this.userService_ = userService;
  }

  async list() {
    return await this.db_.transaction(async (tx) => {
      const storeUser = await tx
        .select()
        .from(store)
        .innerJoin(storeToUser, eq(storeToUser.storeId, store.id))
        .where(eq(storeToUser.userId, this.currentUser_.userId!));

      return storeUser.map(({ store }) => store);
    });
  }
  async get(storeId: string) {
    return await this.db_.transaction(async (tx) => {
      const storeUser = await tx
        .select({
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
        starterPlan.sPlanId
      );

      const newStore = await tx
        .insert(store)
        .values({
          name,
        })
        .returning({
          id: store.id,
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
      name: payload.name,
      active: payload.active,
      updatedAt: new Date(),
    });

    return data[0];
  }
}
