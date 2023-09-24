import stream from "stream";
import { FileServiceUploadResult } from "utils-data";

export type FileServiceGetUploadStreamResult = {
  writeStream: stream.PassThrough;
  promise: Promise<any>;
  url: string;
  fileKey: string;
  [x: string]: unknown;
};

export type GetUploadedFileType = {
  fileKey: string;
  [x: string]: unknown;
};

export type DeleteFileType = {
  fileKey: string;
  [x: string]: unknown;
};

export type UploadStreamDescriptorType = {
  name: string;
  ext?: string;
  acl?: string;
  [x: string]: unknown;
};
export abstract class AbstractFileService {
  abstract upload(
    fileData: Express.Multer.File
  ): Promise<FileServiceUploadResult>;
  abstract uploadProtected(
    fileData: Express.Multer.File
  ): Promise<FileServiceUploadResult>;
  abstract delete(fileKey: string): Promise<void>;
  abstract getUploadStreamDescriptor(
    fileData: UploadStreamDescriptorType
  ): Promise<FileServiceGetUploadStreamResult>;
  abstract getDownloadStream(
    fileData: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream>;
  abstract getPresignedDownloadUrl(
    fileData: GetUploadedFileType
  ): Promise<string>;
}
