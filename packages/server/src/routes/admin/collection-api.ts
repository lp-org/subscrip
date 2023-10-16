import { DELETE, GET, POST, PUT, route } from "awilix-express";
import { Request, Response } from "express";
import CollectionService from "../../services/CollectionService";
import {
  createCollectionDTO,
  deleteCollectionRoomDTO,
  listFilterDTO,
  updateCollectionDTO,
} from "utils-data";
import { whereFilter, pageConfig } from "../../utils/build-query";
import { collection } from "db";

type InjectedDependencies = {
  collectionService: CollectionService;
};

@route("/collections")
export default class CollectionApi {
  protected readonly collectionService_: CollectionService;
  constructor({ collectionService }: InjectedDependencies) {
    this.collectionService_ = collectionService;
  }

  @route("/")
  @GET()
  async list(req: Request, res: Response) {
    const { filters, ...rest } = listFilterDTO.parse(req.query);
    const data = await this.collectionService_.list(
      whereFilter(filters, collection),
      pageConfig(rest)
    );

    res.json(data);
  }

  @route("/:id")
  @GET()
  async get(req: Request, res: Response) {
    const data = await this.collectionService_.get(req.params.id);
    res.json(data);
  }

  @route("/")
  @POST()
  async create(req: Request, res: Response) {
    const validated = createCollectionDTO.parse(req.body);

    const data = await this.collectionService_.create(validated);
    res.json(data);
  }

  @route("/:id")
  @PUT()
  async update(req: Request, res: Response) {
    const validated = updateCollectionDTO.parse(req.body);

    const data = await this.collectionService_.update(req.params.id, validated);
    res.json(data);
  }

  @route("/room/:id")
  @DELETE()
  async deleteCollectionRoom(req: Request, res: Response) {
    const validated = deleteCollectionRoomDTO.parse(req.body);

    const data = await this.collectionService_.deleteCollectionRoom(
      req.params.id,
      validated.room_id
    );
    res.json(data);
  }
}
