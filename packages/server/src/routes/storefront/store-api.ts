import { GET, route } from "awilix-express";
import { Request, Response } from "express";
import StoreService from "../../services/StoreService";

type InjectedDependencies = {
  storeService: StoreService;
};

@route("/store")
export default class StoreApi {
  protected readonly storeService_: StoreService;
  constructor({ storeService }: InjectedDependencies) {
    this.storeService_ = storeService;
  }

  @route("/:url")
  @GET()
  async get(req: Request, res: Response) {
    const store = await this.storeService_.retrieveByUrl(req.params.url);
    res.json({ store });
  }

  @route("/setting/:id")
  @GET()
  async getStoreSetting(req: Request, res: Response) {
    const store = await this.storeService_.getStoreSetting(req.params.id);

    res.json(store);
  }
}
