import { DELETE, GET, POST, PUT, route } from "awilix-express";
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
    const { offset, limit, ...rest } = req.query;
    const room = await this.roomService_.list(
      {
        ...rest,
        q: req.query.q && ["name", req.query.q],
      },
      {
        limit: parseInt(req.query?.limit as string) as number,
        offset: parseInt(req.query?.offset as string) as number,
      }
    );
    res.json(room);
  }

  @route("/:id")
  @GET()
  async getRoom(req: Request, res: Response) {
    const room = await this.roomService_.get(req.params.id);
    res.json(room);
  }

  @route("/")
  @POST()
  async create(req: Request, res: Response) {
    const room = await this.roomService_.create(req.body);
    res.json(room);
  }

  @route("/:id")
  @PUT()
  async update(req: Request, res: Response) {
    const room = await this.roomService_.update(req.params.id, req.body);
    res.json(room);
  }

  @route("/images/:id")
  @PUT()
  async upsertImage(req: Request, res: Response) {
    const room = await this.roomService_.upsertImage(req.params.id, req.body);
    res.json(room);
  }

  @route("/images/:id")
  @DELETE()
  async deleteImage(req: Request, res: Response) {
    const room = await this.roomService_.deleteImage(req.params.id, req.body);
    res.json(room);
  }

  @route("/reorderImages/:id")
  @PUT()
  async reorderImage(req: Request, res: Response) {
    const room = await this.roomService_.reorderImage(req.params.id, req.body);
    res.json(room);
  }
}
