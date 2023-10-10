import { DELETE, GET, POST, PUT, route } from "awilix-express";
import { Request, Response } from "express";
import RoomService from "../../services/RoomService";
import { eq } from "drizzle-orm";
import { room } from "db";

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
    const { offset, limit, ...rest } = req.query;
    const roomData = await this.roomService_.list(
      [eq(room.status, "published")],
      {
        limit: parseInt(req.query?.limit as string) as number,
        offset: parseInt(req.query?.offset as string) as number,
      }
    );
    res.json(roomData);
  }

  @route("/:id")
  @GET()
  async getRoom(req: Request, res: Response) {
    const room = await this.roomService_.get_({
      id: req.params.id,
      status: "published",
    });
    res.json(room);
  }
}
