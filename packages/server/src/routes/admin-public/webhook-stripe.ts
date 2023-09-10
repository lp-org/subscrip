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
}
