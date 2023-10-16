import { GET, POST, before, route } from "awilix-express";
import { PgJsDatabaseType } from "db";

import EventBusService from "../../services/EventBusService";

import jwt from "jsonwebtoken";
import AuthService from "../../services/AuthService";
import { Request, Response } from "express";

type InjectedDependencies = {
  db: PgJsDatabaseType;
  eventBusService: EventBusService;
  authService: AuthService;
};

@route("/auth")
export default class CreateUserApi {
  protected readonly authService_: AuthService;
  protected readonly eventBusService_: EventBusService;
  protected readonly db_: PgJsDatabaseType;
  constructor({ db, eventBusService, authService }: InjectedDependencies) {
    this.eventBusService_ = eventBusService;
    this.db_ = db;
    this.authService_ = authService;
  }

  private signToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "secret", {
      expiresIn: "24h",
    });
  }
  @route("/register")
  @POST()
  async createUser(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await this.authService_.create(req.body, password);

    if (result) {
      // @ts-ignore

      // req.session.jwt = this.signToken(result.id);
      res.cookie("jwt", this.signToken(result.id));
    }
    res.json(result);
  }

  @route("/login")
  @POST()
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await this.authService_.authenticate(email, password);

    if (result) {
      const token = this.signToken(result.id);
      // @ts-ignore
      // req.session.jwt = token;
      res.cookie("jwt", token);
      res.json({ user: result });
    } else {
      res.sendStatus(401);
    }
  }
}
