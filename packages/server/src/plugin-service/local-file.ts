import fs from "fs";
import { parse } from "path";
import {
  AbstractFileService,
  FileServiceGetUploadStreamResult,
  FileServiceUploadResult,
} from "../interfaces/file";
import { env } from "process";
export class LocalFileService extends AbstractFileService {
  protected uploadDir_: string;
  protected backendUrl_: string;

  constructor() {
    super();
    this.uploadDir_ = env.UPLOAD_DIR || "uploads/images";
    this.backendUrl_ = env.BACKEND_URL || "http://localhost:9000";
  }

  async upload(file: Express.Multer.File): Promise<FileServiceUploadResult> {
    return await this.uploadFile(file);
  }

  async uploadProtected(file: Express.Multer.File) {
    return await this.uploadFile(file, {});
  }

  async uploadFile(
    file: Express.Multer.File,
    options = {}
  ): Promise<FileServiceUploadResult> {
    const parsedFilename = parse(file.originalname);

    const fileKey = `${parsedFilename.name}-${Date.now()}${parsedFilename.ext}`;

    return new Promise((resolve) => {
      fs.copyFile(file.path, `${this.uploadDir_}/${fileKey}`, (err) => {
        if (err) {
          throw err;
        }

        const fileUrl = `${this.backendUrl_}/${this.uploadDir_}/${fileKey}`;

        resolve({ url: fileUrl, fileKey });
      });
    });
  }

  async delete(file: any): Promise<void> {
    throw Error("Not implemented");
  }

  async getUploadStreamDescriptor(
    fileData: any
  ): Promise<FileServiceGetUploadStreamResult> {
    throw Error("Not implemented");
  }

  async getDownloadStream(fileData: any): Promise<NodeJS.ReadableStream> {
    throw Error("Not implemented");
  }

  async getPresignedDownloadUrl(fileData: any): Promise<string> {
    throw Error("Not implemented");
  }
}
