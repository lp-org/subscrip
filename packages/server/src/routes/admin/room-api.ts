import { GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import RoomService from "../../services/RoomService";

type InjectedDependencies = {
  roomService: RoomService;
};

@route("/rooms")
export default class RoomApi {
  protected readonly roomService_: RoomService;
  constructor({ roomService }: InjectedDependencies) {
    this.roomService_ = roomService;
  }

  @route("/")
  @GET()
  async list(req: Request, res: Response) {
    const room = await this.roomService_.list();
    res.json(room);
  }

  @route("/")
  @POST()
  async create(req: Request, res: Response) {
    const room = await this.roomService_.create(req.body);
    res.json(room);
  }
}
