// import { authenticate } from './your-auth-middleware'
import { route, GET, before, POST } from "awilix-express"; // or `awilix-router-core`
import UserService from "../../services/UserService";
import { Request, Response } from "express";
import EventBusService from "../../services/EventBusService";

import { PgJsDatabaseType } from "db";
type InjectedDependencies = {
  db: PgJsDatabaseType;
  userService: UserService;
  eventBusService: EventBusService;
  currentUser: number;
};

@route("/users")
export default class UserAPI {
  protected readonly userService_: UserService;
  protected readonly eventBusService_: EventBusService;
  protected readonly db_: PgJsDatabaseType;
  // protected readonly currentUser_: number;
  constructor({ db, userService, eventBusService }: InjectedDependencies) {
    this.userService_ = userService;
    this.eventBusService_ = eventBusService;
    this.db_ = db;
  }

  @route("/")
  @POST()
  async createUser(req: Request, res: Response) {
    const user = await this.db_.transaction(async (tx) => {
      const result = await this.userService_.create(
        req.body,
        req.body.password
      );

      return result;
    });
    res.json(user);
  }

  @route("/")
  @GET()
  async getUser(req: Request, res: Response) {
    const userService = req.container.resolve("userService");

    res.json(await userService.list({}));
  }
}
