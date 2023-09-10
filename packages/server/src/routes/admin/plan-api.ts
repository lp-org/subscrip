import { GET, route } from "awilix-express";
import { Request, Response } from "express";
import PlanService from "../../services/PlanService";

type InjectedDependencies = {
  planService: PlanService;
};

@route("/plans")
export default class PlanApi {
  protected readonly planService_: PlanService;
  constructor({ planService }: InjectedDependencies) {
    this.planService_ = planService;
  }

  @route("/")
  @GET()
  async get(req: Request, res: Response) {
    const data = await this.planService_.list();
    res.json(data);
  }
}
