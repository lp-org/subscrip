import { GET, POST, before, route } from "awilix-express";
import { PgJsDatabaseType } from "db";

import EventBusService from "../../services/EventBusService";
import UserService from "../../services/UserService";
import jwt from "jsonwebtoken";
import AuthService from "../../services/AuthService";
import { Request, Response } from "express";
import auth from "../../middleware/auth";

type InjectedDependencies = {
  db: PgJsDatabaseType;
  userService: UserService;
  eventBusService: EventBusService;
  authService: AuthService;
};

@route("/auth")
export default class CreateUserApi {
  protected readonly userService_: UserService;
  protected readonly authService_: AuthService;
  protected readonly eventBusService_: EventBusService;
  protected readonly db_: PgJsDatabaseType;
  constructor({
    db,
    userService,
    eventBusService,
    authService,
  }: InjectedDependencies) {
    this.userService_ = userService;
    this.eventBusService_ = eventBusService;
    this.db_ = db;
    this.authService_ = authService;
  }
  @route("/register")
  @POST()
  async createUser(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await this.userService_.create(req.body, password);

    if (result) {
      // @ts-ignore
      req.session.jwt = jwt.sign({ userId: result.id }, "secret", {
        expiresIn: "24h",
      });
    }
    res.json(result);
  }

  @route("/login")
  @POST()
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await this.authService_.authenticate(email, password);

    if (result) {
      // @ts-ignore
      req.session.jwt = jwt.sign({ userId: result.id }, "secret", {
        expiresIn: "24h",
      });

      res.json({ user: result });
    } else {
      res.sendStatus(401);
    }
  }

  @route("/me")
  @before([auth()])
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
  @before([auth()])
  @POST()
  async logout(req: Request, res: Response) {
    // @ts-ignore
    req.session.jwt = {};
    res.json({});
  }
}
