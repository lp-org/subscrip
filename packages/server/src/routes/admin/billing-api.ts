import { route, POST, GET } from "awilix-express";
import { Request, Response } from "express";

import PaymentGatewayService from "../../services/PaymentGatewayService";
import StoreBillingService from "../../services/StoreBillingService";
import { z } from "zod";

type InjectedDependencies = {
  paymentGatewayService: PaymentGatewayService;
  storeBillingService: StoreBillingService;
};

@route("/billing")
export default class BillingApi {
  protected readonly paymentGatewayService_: PaymentGatewayService;
  protected readonly storeBillingService_: StoreBillingService;
  constructor({
    paymentGatewayService,
    storeBillingService,
  }: InjectedDependencies) {
    this.paymentGatewayService_ = paymentGatewayService;
    this.storeBillingService_ = storeBillingService;
  }

  @route("/session")
  @POST()
  async get(req: Request, res: Response) {
    const { planId } = req.body;
    const session = await this.paymentGatewayService_.createSession(planId);

    res.json(session);
  }

  @route("/store-subscription")
  @GET()
  async mySubscriptionPlan(req: Request, res: Response) {
    const data = await this.storeBillingService_.getMySubscription(req.query);
    res.json(data);
  }

  @route("/paymentMethod/:id")
  @GET()
  async getPaymentMethod(req: Request, res: Response) {
    const paymentMethodId = req.params.id;
    const data = await this.paymentGatewayService_.getPaymentMethod(
      paymentMethodId
    );
    res.json(data);
  }

  @route("/subscribe")
  @POST()
  async subscribePlan(req: Request, res: Response) {
    const validated = subscribePlanDTO.parse(req.body);

    const { planId } = validated;
    const data = await this.storeBillingService_.subscribePlan(planId);

    res.json(data);
  }

  @route("/subscribe/:id")
  @GET()
  async getStoreSubscriptionPlan(req: Request, res: Response) {
    const data = await this.storeBillingService_.getSubscription(req.params.id);

    res.json(data);
  }
}

const subscribePlanDTO = z.object({
  planId: z.string(),
});
