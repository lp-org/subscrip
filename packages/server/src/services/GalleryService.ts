import { PgJsDatabaseType, gallery } from "db";
import { RESOLVER } from "awilix";
import { CurrentStore } from "../types";
import { BaseService } from "../interfaces/base-service";
type InjectedDependencies = {
  db: PgJsDatabaseType;
  currentStore: CurrentStore;
};
export default class GalleryService extends BaseService {
  static [RESOLVER] = {};
  protected override readonly db_: PgJsDatabaseType;
  protected override readonly currentStore_: CurrentStore;
  constructor({ db, currentStore }: InjectedDependencies) {
    super({ currentStore, db });
    this.db_ = db;
    this.currentStore_ = currentStore;
  }

  async create(fileKey: string, fileType: string, size: number) {
    return await this.db_.transaction(async (tx) => {
      return await tx
        .insert(gallery)
        .values({
          fileKey,
          fileType,
          size,
          storeId: this.currentStore_.storeId,
        })
        .returning();
    });
  }

  async list() {
    return await this.listByStore({}, gallery);
  }
}
