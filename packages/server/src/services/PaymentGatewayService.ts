import { PgJsDatabaseType, plan } from "db";
import { eq } from "drizzle-orm";
import { Stripe } from "stripe";
type InjectedDependencies = {
  db: PgJsDatabaseType;
};
export default class PaymentGatewayService {
  protected stripeApi = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-08-16",
  });
  protected readonly db_: PgJsDatabaseType;
  constructor({ db }: InjectedDependencies) {
    this.db_ = db;
  }
  async createPlan({
    amount,
    interval,
    currency,
    name,
    trialPeriod,
  }: {
    amount: number;
    interval: "day" | "month" | "year";
    currency: string;
    name: string;
    trialPeriod?: number | null;
  }) {
    const plan = await this.stripeApi.plans.create({
      currency,
      interval,
      amount,
      product: {
        name,
      },
      trial_period_days: trialPeriod ? trialPeriod : undefined,
    });
    return plan.id;
  }

  async getPlan(id: string) {
    const plan = await this.stripeApi.plans.retrieve(id);
    return plan;
  }

  async createCustomer(email: string) {
    const customer = await this.stripeApi.customers.create({
      email,
    });
    return customer.id;
  }

  async createSubscription(customerId: string, planId: string, trial: boolean) {
    const plan = await this.stripeApi.subscriptions.create({
      customer: customerId,
      items: [
        {
          plan: planId,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
      trial_from_plan: trial,
      trial_settings: {
        end_behavior: {
          missing_payment_method: "cancel",
        },
      },
    });
    return plan;
  }

  async getSubscription(subscriptionId: string) {
    const plan = await this.stripeApi.subscriptions.retrieve(subscriptionId, {
      expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
    });

    return plan;
  }

  async cancelSubscription(subscriptionId: string) {
    const plan = await this.stripeApi.subscriptions.cancel(subscriptionId);
    return plan;
  }

  async getPaymentMethod(paymentMethodId: string) {
    const paymentMethod = await this.stripeApi.paymentMethods.retrieve(
      paymentMethodId
    );
    return paymentMethod;
  }

  async createSession(planId: string) {
    return await this.db_.transaction(async (tx) => {
      const planData = await tx.select().from(plan).where(eq(plan.id, planId));
      if (!planData) {
        throw new Error("plan not exist");
      }
      const session = await this.stripeApi.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price: planId,
            // For metered billing, do not pass quantity
            quantity: 1,
          },
        ],
        // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
        // the actual Session ID is returned in the query parameter when your customer
        // is redirected to the success page.
        success_url:
          "https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://example.com/canceled.html",
      });
      return session;
    });
  }
}
