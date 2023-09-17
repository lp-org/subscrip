import { GET, POST, PUT, route } from "awilix-express";
import { Request, Response } from "express";
import StoreService from "../../services/StoreService";
import { CurrentStore } from "../../types";

type InjectedDependencies = {
  storeService: StoreService;
  currentStore: CurrentStore;
};

@route("/stores")
export default class StoreApi {
  protected readonly storeService_: StoreService;
  protected readonly currentStore_: CurrentStore;
  constructor({ storeService, currentStore }: InjectedDependencies) {
    this.storeService_ = storeService;
    this.currentStore_ = currentStore;
  }

  @route("/")
  @GET()
  async list(req: Request, res: Response) {
    const store = await this.storeService_.list();
    res.json(store);
  }

  @route("/settings")
  @GET()
  async storeSetting(req: Request, res: Response) {
    const currentStore = await this.currentStore_;
    const store = await this.storeService_.getStoreSetting(
      currentStore.storeId
    );
    res.json(store);
  }

  @route("/settings")
  @PUT()
  async updateStoreSetting(req: Request, res: Response) {
    const currentStore = await this.currentStore_;
    const store = await this.storeService_.updateStoreSetting(
      currentStore.storeId,
      req.body
    );
    res.json(store);
  }

  @route("/")
  @POST()
  async create(req: Request, res: Response) {
    const store = await this.storeService_.create(req.body.name);
    res.json(store);
  }
}
