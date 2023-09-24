// import { authenticate } from './your-auth-middleware'
import { route, POST, before, GET, DELETE } from "awilix-express"; // or `awilix-router-core`
import { Request, Response } from "express";
import multer from "multer";
import DefaultFileService from "../../services/FileService";
import GalleryService from "../../services/GalleryService";
import { deleteFileDTO } from "utils-data";

const upload = multer({ dest: "uploads/" });
type InjectedDependencies = {
  fileService: DefaultFileService;
  galleryService: GalleryService;
};

@route("/gallery")
export default class UploadAPI {
  protected readonly fileService_: DefaultFileService;
  protected readonly galleryService_: GalleryService;
  constructor({ fileService, galleryService }: InjectedDependencies) {
    this.fileService_ = fileService;
    this.galleryService_ = galleryService;
  }

  @route("/upload")
  @POST()
  @before(upload.array("files"))
  // @before([auth()])
  async uploadImage(req: Request, res: Response) {
    const files = req.files as any;
    if (!files?.length) {
      throw new Error("No file");
    }
    const result = await Promise.all(
      files.map(async (f: Express.Multer.File) => {
        return await this.galleryService_.create(f);
      })
    );

    res.json(result);
  }

  @route("/")
  @GET()
  async listImage(req: Request, res: Response) {
    const data = await this.galleryService_.list();
    res.json(data);
  }

  @route("/")
  @DELETE()
  async delete(req: Request, res: Response) {
    const validated = deleteFileDTO.parse(req.body);
    await this.galleryService_.delete(validated.fileKey);
    res.json();
  }
}
