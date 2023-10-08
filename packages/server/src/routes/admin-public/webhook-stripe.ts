import { POST, before, route } from "awilix-express";
import { Request, Response } from "express";
import StoreBillingService from "../../services/StoreBillingService";
import { Stripe } from "stripe";
import { raw } from "body-parser";
import PaymentGatewayService from "../../services/PaymentGatewayService";

type InjectedDependencies = {
  storeBillingService: StoreBillingService;
  paymentGatewayService: PaymentGatewayService;
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});
@route("/webhook")
@before(raw({ type: "application/json" }))
export default class StripeWebhookApi {
  protected readonly storeBillingService_: StoreBillingService;
  protected readonly paymentGatewayService_: PaymentGatewayService;
  constructor({
    storeBillingService,
    paymentGatewayService,
  }: InjectedDependencies) {
    this.storeBillingService_ = storeBillingService;
    this.paymentGatewayService_ = paymentGatewayService;
  }

  @route("/stripe")
  @POST()
  async stripeWebhook(req: Request, res: Response) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;

    try {
      const stripeSignature = req.headers["stripe-signature"];

      if (typeof stripeSignature !== "string") {
        throw new Error("Invalid stripe signature");
      }

      event = stripe.webhooks.constructEvent(
        req.body,
        stripeSignature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.log(err);
      console.log(`⚠️  Webhook signature verification failed.`);
      console.log(
        `⚠️  Check the env file and enter the correct webhook secret.`
      );
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    const dataObject = event.data.object as any;

    // Handle the event
    // Review important events for Billing webhooks
    // https://stripe.com/docs/billing/webhooks
    // Remove comment to see the various objects sent for this sample
    switch (event.type) {
      case "invoice.paid":
        // Used to provision services after the trial has ended.
        // The status of the invoice will show up as paid. Store the status in your
        // database to reference when a user accesses your service to avoid hitting rate limits.

        await this.storeBillingService_.invoiceUpdate({
          subscriptionId: dataObject.subscription,
          customerId: dataObject.customer,
          amount: dataObject.total,
          currency: dataObject.currency,
          invoiceId: dataObject.id,
          status: dataObject.status,
        });
        break;
      case "customer.subscription.created":
        await this.storeBillingService_.subscriptionUpdate({
          sSubscriptionId: dataObject.id,
          status: dataObject.status,
          nextBillingDate: dataObject.current_period_end,
          sPaymentMethodId: dataObject.default_payment_method,
          sPlanId: dataObject.plan.id,
        });
        break;
      case "customer.subscription.updated":
        await this.storeBillingService_.subscriptionUpdate({
          sSubscriptionId: dataObject.id,
          status: dataObject.status,
          nextBillingDate: dataObject.current_period_end,
          sPaymentMethodId: dataObject.default_payment_method,
          sPlanId: dataObject.plan.id,
        });
        break;
      case "customer.subscription.deleted":
        await this.storeBillingService_.subscriptionUpdate({
          sSubscriptionId: dataObject.id,
          status: dataObject.status,
          nextBillingDate: dataObject.current_period_end,
          sPaymentMethodId: dataObject.default_payment_method,
          sPlanId: dataObject.plan.id,
        });
        break;
      case "invoice.payment_failed":
        // If the payment fails or the customer does not have a valid payment method,
        //  an invoice.payment_failed event is sent, the subscription becomes past_due.
        // Use this webhook to notify your user that their payment has
        // failed and to retrieve new card details.
        await this.storeBillingService_.invoiceUpdate({
          subscriptionId: dataObject.subscription,
          customerId: dataObject.customer,
          amount: dataObject.total,
          currency: dataObject.currency,
          invoiceId: dataObject.id,
          status: dataObject.status,
        });
        break;
      case "customer.subscription.deleted":
        if (event.request != null) {
          // handle a subscription canceled by your request
          // from above.
        } else {
          // handle subscription canceled automatically based
          // upon your subscription settings.
        }
        break;
      default:
      // Unexpected event type
    }
    res.sendStatus(200);
  }

  @route("/test")
  @POST()
  async test(req: Request, res: Response) {
    const dataObject = {
      id: "sub_1NuWGwKizAO1fEJEYIncux0B",
      object: "subscription",
      application: null,
      application_fee_percent: null,
      automatic_tax: {
        enabled: false,
      },
      billing_cycle_anchor: 1695801934,
      billing_thresholds: null,
      cancel_at: null,
      cancel_at_period_end: false,
      canceled_at: null,
      cancellation_details: {
        comment: null,
        feedback: null,
        reason: null,
      },
      collection_method: "charge_automatically",
      created: 1695715534,
      currency: "usd",
      current_period_end: 1698393934,
      current_period_start: 1695801934,
      customer: "cus_Ohw8krWsNx8Z9v",
      days_until_due: null,
      default_payment_method: "pm_1NuWkOKizAO1fEJErxGbsC3t",
      default_source: null,
      default_tax_rates: [],
      description: null,
      discount: null,
      ended_at: null,
      items: {
        object: "list",
        data: [
          {
            id: "si_Ohw9hzKdBRMTYI",
            object: "subscription_item",
            billing_thresholds: null,
            created: 1695715534,
            metadata: {},
            plan: {
              id: "plan_OhvwAI064wT7uD",
              object: "plan",
              active: true,
              aggregate_usage: null,
              amount: 200,
              amount_decimal: "200",
              billing_scheme: "per_unit",
              created: 1695714753,
              currency: "usd",
              interval: "month",
              interval_count: 1,
              livemode: false,
              metadata: {},
              nickname: null,
              product: "prod_OhvwrYiXJWwmU7",
              tiers_mode: null,
              transform_usage: null,
              trial_period_days: 1,
              usage_type: "licensed",
            },
            price: {
              id: "plan_OhvwAI064wT7uD",
              object: "price",
              active: true,
              billing_scheme: "per_unit",
              created: 1695714753,
              currency: "usd",
              custom_unit_amount: null,
              livemode: false,
              lookup_key: null,
              metadata: {},
              nickname: null,
              product: "prod_OhvwrYiXJWwmU7",
              recurring: {
                aggregate_usage: null,
                interval: "month",
                interval_count: 1,
                trial_period_days: 1,
                usage_type: "licensed",
              },
              tax_behavior: "unspecified",
              tiers_mode: null,
              transform_quantity: null,
              type: "recurring",
              unit_amount: 200,
              unit_amount_decimal: "200",
            },
            quantity: 1,
            subscription: "sub_1NuWGwKizAO1fEJEYIncux0B",
            tax_rates: [],
          },
        ],
        has_more: false,
        total_count: 1,
        url: "/v1/subscription_items?subscription=sub_1NuWGwKizAO1fEJEYIncux0B",
      },
      latest_invoice: "in_1NuskoKizAO1fEJEkqb4FrOy",
      livemode: false,
      metadata: {},
      next_pending_invoice_item_invoice: null,
      on_behalf_of: null,
      pause_collection: null,
      payment_settings: {
        payment_method_options: null,
        payment_method_types: null,
        save_default_payment_method: "on_subscription",
      },
      pending_invoice_item_interval: null,
      pending_setup_intent: null,
      pending_update: null,
      plan: {
        id: "plan_OhvwAI064wT7uD",
        object: "plan",
        active: true,
        aggregate_usage: null,
        amount: 200,
        amount_decimal: "200",
        billing_scheme: "per_unit",
        created: 1695714753,
        currency: "usd",
        interval: "month",
        interval_count: 1,
        livemode: false,
        metadata: {},
        nickname: null,
        product: "prod_OhvwrYiXJWwmU7",
        tiers_mode: null,
        transform_usage: null,
        trial_period_days: 1,
        usage_type: "licensed",
      },
      quantity: 1,
      schedule: null,
      start_date: 1695715534,
      status: "active",
      test_clock: null,
      transfer_data: null,
      trial_end: 1695801934,
      trial_settings: {
        end_behavior: {
          missing_payment_method: "create_invoice",
        },
      },
      trial_start: 1695715534,
    };

    const data = await this.storeBillingService_.subscriptionUpdate({
      sSubscriptionId: dataObject.id,
      //@ts-ignore
      status: dataObject.status,
      nextBillingDate: dataObject.current_period_end,
      sPaymentMethodId: dataObject.default_payment_method,
      sPlanId: dataObject.plan.id,
    });
    res.sendStatus(200);
  }
}
