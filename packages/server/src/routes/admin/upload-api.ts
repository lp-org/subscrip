// import { authenticate } from './your-auth-middleware'
import { route, POST, before } from "awilix-express"; // or `awilix-router-core`
import { Request, Response } from "express";
import multer from "multer";
import DefaultFileService from "../../services/FileService";
import fs from "fs";
import auth from "../../middleware/auth";
import GalleryService from "../../services/GalleryService";

const upload = multer({ dest: "uploads/" });
type InjectedDependencies = {
  fileService: DefaultFileService;
  galleryService: GalleryService;
};

@route("/upload")
export default class UploadAPI {
  protected readonly fileService_: DefaultFileService;
  protected readonly galleryService_: GalleryService;
  constructor({ fileService, galleryService }: InjectedDependencies) {
    this.fileService_ = fileService;
    this.galleryService_ = galleryService;
  }

  @route("/")
  @POST()
  @before(upload.array("files"))
  @before([auth()])
  async uploadImage(req: Request, res: Response) {
    const files = req.files as any;
    if (!files?.length) {
      throw new Error("No file");
    }
    const result = await Promise.all(
      files.map(async (f: Express.Multer.File) => {
        return this.fileService_.upload(f).then(async (result) => {
          fs.unlinkSync(f.path);
          await this.galleryService_.create(result.fileKey, f.mimetype, f.size);
          return result;
        });
      })
    );

    res.json(result);
  }
}
