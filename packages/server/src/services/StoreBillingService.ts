import {
  PgJsDatabaseType,
  StripeSubscriptionStatusType,
  plan,
  store,
  storeInvoice,
  storeSubscriptionPlan,
} from "db";
import { RESOLVER } from "awilix";
import { CurrentStore } from "../types";
import PaymentGatewayService from "./PaymentGatewayService";
import UserService from "./UserService";
import PlanService from "./PlanService";
import { SQL, and, desc, eq, inArray } from "drizzle-orm";
import Stripe from "stripe";
import { PgTableFn } from "drizzle-orm/pg-core";
import { whereEqQuery } from "../utils/build-query";
type InjectedDependencies = {
  db: PgJsDatabaseType;
  currentStore: CurrentStore;
  currentUser: Express.User;
  paymentGatewayService: PaymentGatewayService;
  userService: UserService;
  planService: PlanService;
};

export default class StoreBillingService {
  static [RESOLVER] = {};
  protected readonly db_: PgJsDatabaseType;
  protected readonly currentUser_: Express.User;
  protected readonly currentStore_: CurrentStore;
  protected readonly paymentGatewayService_: PaymentGatewayService;
  protected readonly userService_: UserService;
  protected readonly planService_: PlanService;
  constructor({
    db,
    currentUser,
    currentStore,
    paymentGatewayService,
    userService,
    planService,
  }: InjectedDependencies) {
    this.db_ = db;
    this.currentUser_ = currentUser;
    this.currentStore_ = currentStore;
    this.paymentGatewayService_ = paymentGatewayService;
    this.userService_ = userService;
    this.planService_ = planService;
  }

  async getMySubscription(filter?: any) {
    const currentStore = this.currentStore_;
    return await this.db_.transaction(async (tx) => {
      return await tx.query.storeSubscriptionPlan.findMany({
        where: and(
          eq(storeSubscriptionPlan.storeId, currentStore.storeId),
          ...whereEqQuery(filter, storeSubscriptionPlan)
        ),
        with: {
          plan: {
            columns: {
              name: true,
              key: true,
            },
          },
          storeInvoice: true,
        },
      });
    });
  }

  async invoiceUpdate({
    invoiceId,
    subscriptionId,
    customerId,
    amount,
    currency,
    status,
  }: {
    invoiceId: string;
    subscriptionId: string;
    customerId: string;
    amount: number;
    currency: string;
    status: string;
  }) {
    await this.db_.transaction(async (tx) => {
      const payload = {
        sCustomerId: customerId,
        sInvoiceId: invoiceId,
        sSubscriptionId: subscriptionId,
        amount,
        currency,
        status,
      };
      await tx
        .insert(storeInvoice)
        .values(payload)
        .onConflictDoUpdate({
          target: storeInvoice.sInvoiceId,
          set: {
            ...payload,
            updatedAt: new Date(),
          },
        });
    });
  }

  async subscriptionUpdate({
    sSubscriptionId,
    nextBillingDate,
    sPlanId,
    status,
    sPaymentMethodId,
  }: {
    sSubscriptionId: string;
    sPlanId: string;
    nextBillingDate: number;
    status: StripeSubscriptionStatusType;
    sPaymentMethodId: string;
  }) {
    await this.db_.transaction(async (tx) => {
      let active = true;
      const planData = await this.db_.query.plan.findFirst({
        where: eq(plan.sPlanId, sPlanId),
      });
      if (!planData) {
        throw new Error("No plan found");
      }
      if (planData) {
        const result = await tx
          .update(storeSubscriptionPlan)
          .set({
            status,
            nextBillingDate: new Date(nextBillingDate * 1000),
            sSubscriptionId,
            sPaymentMethodId,
            planId: planData.id,
            updatedAt: new Date(),
          })
          .where(eq(storeSubscriptionPlan.sSubscriptionId, sSubscriptionId))
          .returning();
        if (
          status === "canceled" ||
          (status === "incomplete_expired" && result[0])
        ) {
          active = false;
        }
        await tx
          .update(store)
          .set({ active, plan: planData.name, planStatus: status })
          .where(eq(store.id, result[0]?.storeId!));
      }
    });
  }

  async subscribePlan(planId: string) {
    return await this.db_.transaction(async (tx) => {
      let subscription: Stripe.Response<Stripe.Subscription>;
      let subscriptionId, storeSubscriptionPlanId;
      let trial = true;
      const currentStore = this.currentStore_;
      if (!this.currentUser_.userId) {
        throw new Error("No user");
      }
      const user = await this.userService_.get(this.currentUser_.userId);
      if (!user || !user.sCustomerId) {
        throw new Error("User or customerId not found");
      }
      const planData = await this.planService_.get(planId);
      if (!planData || !planData.sPlanId) {
        throw new Error("Plan not found");
      }

      const currentSubscription =
        await tx.query.storeSubscriptionPlan.findFirst({
          where: and(eq(storeSubscriptionPlan.storeId, currentStore.storeId)),
          orderBy: desc(storeSubscriptionPlan.createdAt),
        });

      if (!currentSubscription?.sSubscriptionId) {
        throw new Error("No Subsciption ID");
      }

      if (currentSubscription) {
        // if store has create subscription before, no trial allowed
        trial = false;
      }

      if (
        currentSubscription?.status === "active" ||
        currentSubscription?.status === "trialing"
      ) {
        throw new Error("You already have a active plan.");
      } else if (currentSubscription?.status !== "canceled") {
        await this.paymentGatewayService_.cancelSubscription(
          currentSubscription.sSubscriptionId
        );
      }

      subscription = await this.paymentGatewayService_.createSubscription(
        user.sCustomerId,
        planData.sPlanId,
        trial
      );

      const payload = {
        planId,
        currency: planData.currency,
        price: planData.price,
        storeId: currentStore.storeId,
        sSubscriptionId: subscription.id,
      };
      subscriptionId = subscription.id;
      const result = await tx
        .insert(storeSubscriptionPlan)
        .values(payload)
        .returning();
      storeSubscriptionPlanId = result[0].id;
      // else if (currentSubscription?.sSubscriptionId) {
      //   subscriptionId = currentSubscription.sSubscriptionId;
      //   subscription = await this.paymentGatewayService_.getSubscription(
      //     subscriptionId
      //   );
      //   subscription.latest_invoice;
      // }

      // subscriptionId = subscription.id;
      // if (typeof subscription.latest_invoice === "object") {
      //   if (typeof subscription.latest_invoice?.payment_intent === "object") {
      //     clientSecret =
      //       subscription.latest_invoice?.payment_intent?.client_secret;
      //   }
      // }
      // else if (typeof subscription.pending_setup_intent === "object") {
      //   clientSecret = subscription.pending_setup_intent?.client_secret;
      // }
      return { storeSubscriptionPlanId };
    });
  }

  async getSubscription(storeSubscriptionPlanId: string) {
    const data = await this.db_.query.storeSubscriptionPlan.findFirst({
      where: and(
        eq(storeSubscriptionPlan.storeId, this.currentStore_.storeId),
        eq(storeSubscriptionPlan.id, storeSubscriptionPlanId)
      ),
    });
    if (!data) {
      throw new Error("Subscription Plan not found");
    }
    if (!data?.sSubscriptionId) {
      throw new Error("S_Subscription_ID not found");
    }
    const subscription = await this.paymentGatewayService_.getSubscription(
      data?.sSubscriptionId
    );

    const clientSecret =
      // @ts-ignore
      subscription.latest_invoice?.payment_intent?.client_secret ||
      // @ts-ignore
      subscription.pending_setup_intent?.client_secret;
    return { subscriptionId: data.sSubscriptionId, clientSecret };
  }
}
