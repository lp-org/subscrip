import { PgJsDatabaseType, room, roomSchema, store } from "db";
import { RESOLVER } from "awilix";
import { InferModel, and, eq } from "drizzle-orm";
import { CurrentStore } from "../types";
type InjectedDependencies = {
  db: PgJsDatabaseType;
  currentStore: CurrentStore;
};

type BuildQueryType = {
  offset?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
};

type NewRoomType = typeof room.$inferInsert;
type RoomType = typeof room.$inferSelect;
export default class RoomService {
  static [RESOLVER] = {};
  protected readonly db_: PgJsDatabaseType;

  protected readonly currentStore_: CurrentStore;
  constructor({ db, currentStore }: InjectedDependencies) {
    this.db_ = db;
    this.currentStore_ = currentStore;
  }

  async list() {
    const currentStore = await this.currentStore_;
    return await this.db_.transaction(async (tx) => {
      const result = await tx.query.store.findMany({
        columns: {},
        with: {
          room: {
            limit: 10,
          },
        },
        where: eq(store.id, currentStore.storeId),
      });
      return result[0];
    });
  }

  async create(payload: NewRoomType) {
    const currentStore = await this.currentStore_;
    roomSchema.parse(payload);
    return await this.db_.transaction(async (tx) => {
      const result = await tx
        .insert(room)
        .values({ ...payload, storeId: currentStore.storeId })
        .returning({
          id: room.id,
        });
      return result[0];
    });
  }

  async update(id: string, payload: NewRoomType) {
    const currentStore = await this.currentStore_;
    // check current store
    const roomResult = await this.db_
      .select()
      .from(room)
      .where(and(eq(room.id, id), eq(room.storeId, currentStore.storeId)));
    if (!roomResult[0]) {
      throw new Error("Room not found");
    }
    await this.db_.transaction(async (tx) => {
      return await tx
        .update(room)
        .set({ ...payload, storeId: currentStore.storeId })
        .where(eq(room.id, id))
        .returning({
          id: room.id,
        });
    });
  }
}
