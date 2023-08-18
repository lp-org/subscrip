// import { authenticate } from './your-auth-middleware'
import { route, GET, before } from "awilix-express"; // or `awilix-router-core`
import UserService from "../../services/UserService";
import { Request, Response } from "express";
import EventBusService from "../../services/EventBusService";
import { authMiddleware } from "../../middleware/auth";
type InjectedDependencies = {
  userService: UserService;
  eventBusService: EventBusService;
  currentUser: number;
};

@route("/users")
@before([authMiddleware()])
export default class UserAPI {
  protected readonly userService_: UserService;
  protected readonly eventBusService_: EventBusService;
  // protected readonly currentUser_: number;
  constructor({ userService, eventBusService }: InjectedDependencies) {
    this.userService_ = userService;
    this.eventBusService_ = eventBusService;
  }

  @route("/:id")
  @GET()
  async getUser(req: Request, res: Response) {
    // this.eventBusService_.emit("room.ordered", { test: "123" });
    console.log(req.user);
    const userService = req.container.resolve("userService");

    res.json(await userService.list({}));
  }
}
