import fs from "fs";
import aws, {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { parse } from "path";

import stream from "stream";
import { PutObjectRequest, S3ClientConfig, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  AbstractFileService,
  DeleteFileType,
  FileServiceUploadResult,
  GetUploadedFileType,
  UploadStreamDescriptorType,
} from "../interfaces/file";
import { env } from "process";
class S3Service extends AbstractFileService {
  protected bucket_: string;
  protected s3Url_: string;
  protected accessKeyId_: string;
  protected secretAccessKey_: string;
  protected region_: string;
  protected endpoint_: string;
  protected awsConfigObject_: any;
  protected downloadFileDuration_: string;

  constructor({}) {
    super();

    this.bucket_ = env.bucket || "";
    this.s3Url_ = env.s3_url || "";
    this.accessKeyId_ = env.access_key_id || "";
    this.secretAccessKey_ = env.secret_access_key || "";
    this.region_ = env.region || "";
    this.endpoint_ = env.endpoint || "";
    this.downloadFileDuration_ = env.download_file_duration || "";
    this.awsConfigObject_ = env.aws_config_object ?? {};
  }

  protected getClient(overwriteConfig: Partial<S3ClientConfig> = {}) {
    const config: S3ClientConfig = {
      accessKeyId: this.accessKeyId_,
      secretAccessKey: this.secretAccessKey_,
      region: this.region_,
      endpoint: this.endpoint_,
      ...this.awsConfigObject_,
      ...overwriteConfig,
    };

    return new S3Client(config);
  }

  async upload(file: Express.Multer.File): Promise<FileServiceUploadResult> {
    return await this.uploadFile(file);
  }

  async uploadProtected(file: Express.Multer.File) {
    return await this.uploadFile(file, { acl: "private" });
  }

  async uploadFile(
    file: Express.Multer.File,
    options: { isProtected?: boolean; acl?: string } = {
      isProtected: false,
      acl: undefined,
    }
  ) {
    const client = this.getClient();

    const parsedFilename = parse(file.originalname);

    const fileKey = `${parsedFilename.name}-${Date.now()}${parsedFilename.ext}`;

    const params = new PutObjectCommand({
      ACL: options.acl ?? (options.isProtected ? "private" : "public-read"),
      Bucket: this.bucket_,
      Body: fs.createReadStream(file.path),
      Key: fileKey,
      ContentType: file.mimetype,
    });

    const result = await client.send(params);

    return {
      //@ts-ignore
      url: result.Location,
      //@ts-ignore
      key: result.Key,
    };
  }

  async delete(file: DeleteFileType): Promise<void> {
    const client = this.getClient();

    const params = new DeleteObjectCommand({
      Bucket: this.bucket_,
      Key: `${file}`,
    });

    return new Promise((resolve, reject) => {
      client.send(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  async getUploadStreamDescriptor(fileData: UploadStreamDescriptorType) {
    const client = this.getClient();
    const pass = new stream.PassThrough();

    const fileKey = `${fileData.name}.${fileData.ext}`;
    const params = new PutObjectCommand({
      ACL: fileData.acl ?? "private",
      Bucket: this.bucket_,
      Body: pass,
      Key: fileKey,
      ContentType: fileData.contentType as string,
    });

    return {
      writeStream: pass,
      promise: client.send(params),
      url: `${this.s3Url_}/${fileKey}`,
      fileKey,
    };
  }

  async getDownloadStream(
    fileData: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream> {
    const client = this.getClient();

    const params = new GetObjectCommand({
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
    });
    const item = await client.send(params);
    //@ts-ignore
    return item.Body!.transformToWebStream();
  }

  async getPresignedDownloadUrl(
    fileData: GetUploadedFileType
  ): Promise<string> {
    const client = this.getClient();

    const params = new GetObjectCommand({
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
      // Expires: this.downloadFileDuration_,
    });

    return await getSignedUrl(client, params, { expiresIn: 3600 });
  }
}

export default S3Service;
