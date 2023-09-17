import { GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import CustomerService from "../../services/CustomerService";

type InjectedDependencies = {
  customerService: CustomerService;
};

@route("/customer")
export default class CustomerApi {
  protected readonly customerService_: CustomerService;
  constructor({ customerService }: InjectedDependencies) {
    this.customerService_ = customerService;
  }

  @route("/")
  @GET()
  async listCustomer(req: Request, res: Response) {
    const data = await this.customerService_.list({
      ...req.body,
      q: req.query.q && ["email", req.query.q],
    });
    res.json(data);
  }

  @route("/")
  @POST()
  async createCustomer(req: Request, res: Response) {
    const data = await this.customerService_.create(req.body);
    res.json(data);
  }
}
