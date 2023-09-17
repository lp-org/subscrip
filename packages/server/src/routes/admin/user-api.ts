// import { authenticate } from './your-auth-middleware'
import { route, GET, before, POST } from "awilix-express"; // or `awilix-router-core`
import UserService from "../../services/UserService";
import { Request, Response } from "express";
import EventBusService from "../../services/EventBusService";

import { PgJsDatabaseType } from "db";
import AuthService from "../../services/AuthService";
type InjectedDependencies = {
  db: PgJsDatabaseType;
  userService: UserService;
  authService: AuthService;
  eventBusService: EventBusService;
  currentUser: number;
};

@route("/users")
export default class UserAPI {
  protected readonly userService_: UserService;
  protected readonly authService_: AuthService;
  protected readonly eventBusService_: EventBusService;
  protected readonly db_: PgJsDatabaseType;
  // protected readonly currentUser_: number;
  constructor({
    db,
    userService,
    eventBusService,
    authService,
  }: InjectedDependencies) {
    this.userService_ = userService;
    this.authService_ = authService;
    this.eventBusService_ = eventBusService;
    this.db_ = db;
  }

  @route("/")
  @POST()
  async createUser(req: Request, res: Response) {
    const user = await this.db_.transaction(async (tx) => {
      const result = await this.authService_.create(
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

  @route("/me")
  @GET()
  async getSession(req: Request, res: Response) {
    if (req.user && req.user.userId) {
      const user = await this.userService_.get(req.user.userId);
      if (!user) {
        res.sendStatus(401);
      }
      res.json(user);
    } else {
      res.sendStatus(401);
    }
  }

  @route("/logout")
  @POST()
  async logout(req: Request, res: Response) {
    // @ts-ignore
    req.session.jwt = {};
    res.json({});
  }
}
