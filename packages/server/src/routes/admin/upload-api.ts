// import { authenticate } from './your-auth-middleware'
import { route, POST, before } from "awilix-express"; // or `awilix-router-core`
import { Request, Response } from "express";
import multer from "multer";
import DefaultFileService from "../../services/FileService";
import fs from "fs";
const upload = multer({ dest: "uploads/" });
type InjectedDependencies = {
  fileService: DefaultFileService;
};

@route("/upload")
export default class UploadAPI {
  protected readonly fileService_: DefaultFileService;
  constructor({ fileService }: InjectedDependencies) {
    this.fileService_ = fileService;
  }

  @route("/")
  @POST()
  @before(upload.array("files"))
  // @before([authenticate()])
  async getUser(req: Request, res: Response) {
    const files = req.files as any;
    if (!files?.length) {
      throw new Error("No file");
    }
    const result = await Promise.all(
      files.map(async (f: Express.Multer.File) => {
        return this.fileService_.upload(f).then((result) => {
          fs.unlinkSync(f.path);
          return result;
        });
      })
    );

    res.json(result);
  }
}
