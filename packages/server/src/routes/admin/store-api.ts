import { GET, route } from "awilix-express";
import { Request, Response } from "express";
import StoreService from "../../services/StoreService";

type InjectedDependencies = {
  storeService: StoreService;
};

@route("/stores")
export default class StoreApi {
  protected readonly storeService_: StoreService;
  constructor({ storeService }: InjectedDependencies) {
    this.storeService_ = storeService;
  }

  @route("/")
  @GET()
  async list(req: Request, res: Response) {
    const store = await this.storeService_.list();
    res.json({ store });
  }
}
