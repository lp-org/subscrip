import {
  AbstractFileService,
  FileServiceUploadResult,
  UploadStreamDescriptorType,
  FileServiceGetUploadStreamResult,
  GetUploadedFileType,
} from "../interfaces/file";
import { RESOLVER } from "awilix";
class DefaultFileService extends AbstractFileService {
  static [RESOLVER] = {};
  async upload(
    fileData: Express.Multer.File
  ): Promise<FileServiceUploadResult> {
    throw new Error(
      "Please add a file service plugin in order to manipulate files in Medusa"
    );
  }
  async uploadProtected(
    fileData: Express.Multer.File
  ): Promise<FileServiceUploadResult> {
    throw new Error(
      "Please add a file service plugin in order to manipulate files in Medusa"
    );
  }
  async delete(fileData: Record<string, any>): Promise<void> {
    throw new Error(
      "Please add a file service plugin in order to manipulate files in Medusa"
    );
  }
  async getUploadStreamDescriptor(
    fileData: UploadStreamDescriptorType
  ): Promise<FileServiceGetUploadStreamResult> {
    throw new Error(
      "Please add a file service plugin in order to manipulate files in Medusa"
    );
  }
  async getDownloadStream(
    fileData: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream> {
    throw new Error(
      "Please add a file service plugin in order to manipulate files in Medusa"
    );
  }
  async getPresignedDownloadUrl(
    fileData: GetUploadedFileType
  ): Promise<string> {
    throw new Error(
      "Please add a file service plugin in order to manipulate files in Medusa"
    );
  }
}

export default DefaultFileService;
