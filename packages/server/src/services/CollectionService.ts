import {
  Collection,
  PgJsDatabaseType,
  collection,
  room,
  roomCollections,
} from "db";
import { RESOLVER } from "awilix";
import { CurrentStore } from "../types";
import { SQL, and, desc, eq, getTableColumns, inArray, sql } from "drizzle-orm";
import { jsonAgg, whereFilter } from "../utils/build-query";
import { BaseService } from "../interfaces/base-service";
import {
  PageConfig,
  createCollectionType,
  updateCollectionType,
} from "utils-data";
type InjectedDependencies = {
  db: PgJsDatabaseType;
  currentStore: CurrentStore;
};
export default class CollectionService extends BaseService {
  static [RESOLVER] = {};
  protected override readonly db_: PgJsDatabaseType;
  protected override readonly currentStore_: CurrentStore;
  constructor({ db, currentStore }: InjectedDependencies) {
    super({
      db,
      currentStore,
    });
    this.db_ = db;
    this.currentStore_ = currentStore;
  }

  async list(filter: SQL[], pageConfig?: PageConfig) {
    const { ...columns } = getTableColumns(collection);
    let query = this.db_
      .select({
        ...columns,
        rooms: jsonAgg(room, sql`ORDER BY ${roomCollections.position}`),
      })
      .from(collection)
      .leftJoin(
        roomCollections,
        eq(roomCollections.collectionId, collection.id)
      )
      .leftJoin(room, eq(roomCollections.roomId, room.id))
      .where(and(...filter, this.whereByStore(collection)))
      .groupBy(collection.id)
      .orderBy(desc(collection.createdAt));

    query = this.paginate(query, pageConfig);
    const count = await this.listCountByStore(and(...filter), collection);
    const data = await query;

    return { count, collection: data };
  }

  async get(id: string): Promise<Collection> {
    let data = await this.db_
      .select()
      .from(collection)
      .where(and(eq(collection.id, id), this.whereByStore(collection)));

    return data[0];
  }

  async create(payload: createCollectionType) {
    const { room_id, ...rest } = payload;
    const data = await this.db_
      .insert(collection)
      .values({
        ...rest,
        storeId: this.currentStore_.storeId,
      })
      .returning();
    if (room_id.length) {
      const newRoomCollections = room_id.map((el, i) => ({
        collectionId: data[0].id,
        roomId: el,
        position: i,
      }));
      await this.db_.insert(roomCollections).values(newRoomCollections);
    }

    return data[0].id;
  }

  async update(id: string, payload: updateCollectionType) {
    const { room_id, ...rest } = payload;
    let data: any;
    return await this.db_.transaction(async (tx) => {
      if (room_id) {
        await tx
          .delete(roomCollections)
          .where(eq(roomCollections.collectionId, id));
        if (room_id.length) {
          const newRoomCollections = room_id.map((el, i) => ({
            collectionId: id,
            roomId: el,
            position: i,
          }));
          data = await tx
            .insert(roomCollections)
            .values(newRoomCollections)
            .returning();
        }
      }
      if (Object.keys(rest).length) {
        data = await tx
          .update(collection)
          .set(
            rest && {
              ...rest,
            }
          )
          .where(eq(collection.id, id))
          .returning();
      }
      return data;
    });
  }

  async deleteCollectionRoom(id: string, room_id: string[]) {
    return await this.db_.transaction(async (tx) => {
      const data = await tx
        .delete(roomCollections)
        .where(
          and(
            eq(roomCollections.collectionId, id),
            inArray(roomCollections.roomId, room_id)
          )
        );
      return data;
    });
  }
}
