import { GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import PaymentMethodService from "../../services/PaymentMethodService";
import { stripeConnectAccountDTO } from "utils-data";

type InjectedDependencies = {
  paymentMethodService: PaymentMethodService;
};

@route("/payment-method")
export default class PaymentMethodApi {
  protected readonly paymemtmethodService_: PaymentMethodService;
  constructor({ paymentMethodService }: InjectedDependencies) {
    this.paymemtmethodService_ = paymentMethodService;
  }

  @route("/")
  @GET()
  async get(req: Request, res: Response) {
    const data = await this.paymemtmethodService_.list();
    res.json(data);
  }

  @route("/:id")
  @GET()
  async getStorePaymentMethod(req: Request, res: Response) {
    const data = await this.paymemtmethodService_.getStorePaymentMethod(
      req.params.id
    );
    res.json(data);
  }

  @route("/stripe-connect-account")
  @POST()
  async stripeConnectAccount(req: Request, res: Response) {
    const validated = stripeConnectAccountDTO.parse(req.body);
    const { return_url, refresh_url } = validated;
    const data = await this.paymemtmethodService_.getStripeConnectLink(
      refresh_url,
      return_url
    );
    res.json(data);
  }

  @route("/stripe-account/:id")
  @POST()
  async getStripeAccount(req: Request, res: Response) {
    const { return_url, refresh_url } = req.body;
    const data = await this.paymemtmethodService_.getStripeConnectLink(
      refresh_url,
      return_url
    );
    res.json(data);
  }
}
