import { PgJsDatabaseType, gallery } from "db";
import { RESOLVER } from "awilix";
import { CurrentStore } from "../types";
import { BaseService } from "../interfaces/base-service";
import { set } from "lodash";
import DefaultFileService from "./FileService";
import { morphism, toJSObject } from "morphism";
import { and, eq, inArray } from "drizzle-orm";
import fs from "fs";
type InjectedDependencies = {
  db: PgJsDatabaseType;
  currentStore: CurrentStore;
  fileService: DefaultFileService;
};
type FileKeyType<T> = T extends string
  ? string | undefined
  : T extends string[]
  ? string[]
  : never;
export default class GalleryService extends BaseService {
  static [RESOLVER] = {};
  protected override readonly db_: PgJsDatabaseType;
  protected override readonly currentStore_: CurrentStore;
  protected readonly fileService_: DefaultFileService;

  constructor({ db, currentStore, fileService }: InjectedDependencies) {
    super({ currentStore, db });
    this.db_ = db;
    this.currentStore_ = currentStore;
    this.fileService_ = fileService;
  }

  async create(file: Express.Multer.File) {
    return await this.db_.transaction(async (tx) => {
      return this.fileService_.upload(file).then(async ({ fileKey, url }) => {
        fs.unlinkSync(file.path);
        const data = await tx
          .insert(gallery)
          .values({
            url,
            fileKey,
            fileType: file.mimetype,
            size: file.size,
            storeId: this.currentStore_.storeId,
          })
          .returning();

        return data[0];
      });
      // const data = await tx
      //   .insert(gallery)
      //   .values({
      //     url,
      //     fileKey,
      //     fileType,
      //     size,
      //     storeId: this.currentStore_.storeId,
      //   })
      //   .returning();
      // data[0].fileKey = this.fileService_.getFileUrl(data[0].fileKey);
      // return data[0];
    });
  }

  async list() {
    const data = await this.listByStore({}, gallery);
    return data;
  }

  async delete(fileKey: string[]) {
    const deleteProcess = async (fk: string) => {
      await this.fileService_.delete(fk);

      await this.db_
        .delete(gallery)
        .where(
          and(
            eq(gallery.fileKey, fk),
            eq(gallery.storeId, this.currentStore_.storeId)
          )
        );
    };

    await Promise.all(fileKey.map((el) => deleteProcess(el))).catch(() => {
      throw new Error("delete file err");
    });
  }

  async getFileKey<T extends string | string[]>(
    galleryIds: T
  ): Promise<FileKeyType<T>> {
    if (typeof galleryIds === "string") {
      const data = await this.db_.query.gallery.findFirst({
        where: eq(gallery.id, galleryIds),
      });
      return data?.fileKey as FileKeyType<T>;
    } else if (Array.isArray(galleryIds.length)) {
      const data = await this.db_.query.gallery.findMany({
        where: inArray(gallery.id, galleryIds),
      });
      return data.map((el) => el.fileKey) as FileKeyType<T>;
    }
    return undefined as FileKeyType<T>;
  }
}
