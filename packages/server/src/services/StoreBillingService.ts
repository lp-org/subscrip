import {
  NewStoreSubscriptionPlan,
  PgJsDatabaseType,
  StripeSubscriptionStatusType,
  plan,
  storeInvoice,
  storeSubscriptionPlan,
} from "db";
import { RESOLVER } from "awilix";
import { CurrentStore } from "../types";
import PaymentGatewayService from "./PaymentGatewayService";
import UserService from "./UserService";
import PlanService from "./PlanService";
import { SQL, and, eq, inArray } from "drizzle-orm";
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

  async getMySubscription(filter?: NewStoreSubscriptionPlan) {
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
      const planData = await this.db_.query.plan.findFirst({
        where: eq(plan.sPlanId, sPlanId),
      });
      if (!planData) {
        throw new Error("No plan found");
      }
      if (planData) {
        await tx
          .update(storeSubscriptionPlan)
          .set({
            status,
            nextBillingDate: new Date(nextBillingDate * 1000),
            sSubscriptionId,
            sPaymentMethodId,
            planId: planData.id,
            updatedAt: new Date(),
          })
          .where(eq(storeSubscriptionPlan.sSubscriptionId, sSubscriptionId));
      }
    });
  }

  async subscribePlan(planId: string) {
    let subscription: Stripe.Response<Stripe.Subscription>;
    let subscriptionId, clientSecret;
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
      await this.db_.query.storeSubscriptionPlan.findFirst({
        where: and(
          eq(storeSubscriptionPlan.storeId, currentStore.storeId),
          inArray(storeSubscriptionPlan.status, [
            "active",
            "incomplete",
            "trialing",
          ])
        ),
      });
    if (currentSubscription?.sSubscriptionId) {
      subscriptionId = currentSubscription.sSubscriptionId;
      subscription = await this.paymentGatewayService_.getSubscription(
        subscriptionId
      );
      subscription.latest_invoice;
    } else {
      subscription = await this.paymentGatewayService_.createSubscription(
        user.sCustomerId,
        planData.sPlanId
      );

      const payload = {
        planId,
        currency: planData.currency,
        price: planData.price,
        storeId: currentStore.storeId,
        sSubscriptionId: subscription.id,
      };
      await this.db_.insert(storeSubscriptionPlan).values(payload);
    }

    subscriptionId = subscription.id;
    if (typeof subscription.latest_invoice === "object") {
      if (typeof subscription.latest_invoice?.payment_intent === "object") {
        clientSecret =
          subscription.latest_invoice?.payment_intent?.client_secret;
      }
    }

    if (typeof subscription.pending_setup_intent === "object") {
      clientSecret = subscription.pending_setup_intent?.client_secret;
    }
    return { subscriptionId, clientSecret };
  }
}
