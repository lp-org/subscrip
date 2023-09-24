import fs from "fs";
import { parse } from "path";
import {
  AbstractFileService,
  FileServiceGetUploadStreamResult,
} from "../interfaces/file";
import { env } from "process";
import { FileServiceUploadResult } from "utils-data";
export class LocalFileService extends AbstractFileService {
  protected uploadDir_: string;
  protected backendUrl_: string;

  constructor() {
    super();
    this.uploadDir_ = env.UPLOAD_DIR || "uploads/images";
    this.backendUrl_ = env.BACKEND_URL || "http://localhost:5000";
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

        resolve({ url: fileUrl, fileKey: `${this.uploadDir_}/${fileKey}` });
      });
    });
  }

  async delete(fileKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const filePath = `${process.cwd()}/${fileKey}`;

      if (fs.existsSync(filePath)) {
        console.log(filePath);
        fs.unlinkSync(filePath);
        resolve();
      }
      reject("No path found");
    });
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

  getFileUrl(fileKey?: string) {
    if (!fileKey) return null;
    return this.backendUrl_ + fileKey;
  }
}
