import {
  Gallery,
  PgJsDatabaseType,
  Room,
  gallery,
  room,
  roomImages,
  roomSchema,
  store,
} from "db";
import { RESOLVER } from "awilix";
import {
  InferModel,
  SQL,
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  getTableName,
  inArray,
  sql,
} from "drizzle-orm";
import { CurrentStore } from "../types";
import { BaseService } from "../interfaces/base-service";
import GalleryService from "./GalleryService";
import {
  PageConfig,
  createRoomDTO,
  createRoomType,
  updateRoomDTO,
  updateRoomImageType,
  updateRoomType,
  upsertRoomImageDTO,
} from "utils-data";
import { jsonAgg } from "../utils/build-query";

type InjectedDependencies = {
  db: PgJsDatabaseType;
  currentStore: CurrentStore;
  galleryService: GalleryService;
};

export default class RoomService extends BaseService {
  static [RESOLVER] = {};
  protected override readonly db_: PgJsDatabaseType;
  protected readonly galleryService_: GalleryService;
  protected override readonly currentStore_: CurrentStore;
  constructor({ db, currentStore, galleryService }: InjectedDependencies) {
    super({
      db,
      currentStore,
    });
    this.db_ = db;
    this.currentStore_ = currentStore;
    this.galleryService_ = galleryService;
  }

  async list(
    filter: SQL<unknown>[],
    pageConfig?: PageConfig
  ): Promise<{ room: Room[]; count: number }> {
    // const query = this.db_.query.room.findMany({
    //   with: {
    //     images: {
    //       with: {
    //         gallery: true,
    //       },
    //       columns: {
    //         roomId: false,
    //         galleryId: false,
    //       },

    //       orderBy: asc(roomImages.position),
    //     },
    //   },
    //   where: and(...filter, eq(room.storeId, this.currentStore_.storeId)),
    //   offset: pageConfig?.offset,
    //   limit: pageConfig?.limit,
    //   orderBy: desc(room.createdAt),
    // });

    const roomColumns = getTableColumns(room);
    let query = this.db_
      .select({
        ...roomColumns,
        images: jsonAgg(gallery, sql`ORDER BY ${roomImages.position}`),
      })
      .from(room)
      .leftJoin(roomImages, eq(roomImages.roomId, room.id))
      .leftJoin(gallery, eq(roomImages.galleryId, gallery.id))
      .groupBy(room.id)
      .where(and(...filter, eq(room.storeId, this.currentStore_.storeId)))

      .orderBy(desc(room.createdAt));

    if (pageConfig?.offset !== undefined && pageConfig?.limit !== undefined) {
      query = query.offset(pageConfig?.offset).limit(pageConfig?.limit);
    }
    const data = await query;

    const count = await this.listCountByStore(
      and(...filter, eq(room.storeId, this.currentStore_.storeId)),
      room
    );
    // const data = await this.listByStore(
    //   filter,
    //   room,

    //   pageConfig
    // );
    // const result = { ...data, room: data.room.map((el) => ({ ...el })) };
    return {
      room: data,
      count,
    };
  }

  async create(payload: createRoomType) {
    const currentStore = this.currentStore_;
    const validated = createRoomDTO.parse(payload);

    return await this.db_.transaction(async (tx) => {
      const roomData = await tx
        .insert(room)
        .values({
          ...payload,
          storeId: currentStore.storeId,
        })
        .returning({
          id: room.id,
        });

      if (validated.images) {
        const newRoomImages =
          validated.images.map((el, i) => ({
            roomId: roomData[0].id,
            galleryId: el,
            position: i,
          })) || [];

        await tx.insert(roomImages).values(newRoomImages);
      }
      return roomData[0];
    });
  }

  async get(id: string) {
    return this.get_({ id });
  }

  async get_(query: any) {
    const data = await this.db_.query.room.findFirst({
      with: {
        images: {
          with: {
            gallery: true,
          },
          orderBy: asc(roomImages.position),
        },
      },
      where: and(...this.whereEqQueryByStore(query, room)),
    });
    const result = data && {
      ...data,
      images: data.images.map((el) => el.gallery),
    };

    return result;
  }

  async update(id: string, payload: updateRoomType) {
    const currentStore = this.currentStore_;

    const roomResult = await this.db_
      .select()
      .from(room)
      .where(and(eq(room.id, id), eq(room.storeId, currentStore.storeId)));
    if (!roomResult[0]) {
      throw new Error("Room not found");
    }
    return await this.db_.transaction(async (tx) => {
      const validated = updateRoomDTO.parse(payload);
      const data = await tx
        .update(room)
        .set({ ...validated })
        .where(eq(room.id, id))
        .returning({
          id: room.id,
        });
      return data[0];
    });
  }

  async upsertImage(id: string, payload: updateRoomImageType) {
    const validated = upsertRoomImageDTO.parse(payload);
    const roomResult = await this.db_
      .select()
      .from(room)
      .where(
        and(eq(room.id, id), eq(room.storeId, this.currentStore_.storeId))
      );
    if (!roomResult[0]) {
      throw new Error("Room not found");
    }

    return await this.db_.transaction(async (tx) => {
      const lastImage = await tx
        .select()
        .from(roomImages)
        .orderBy(desc(roomImages.position));
      let lastImagePosition = lastImage[0]?.position || 0;
      const imagePayload = validated.g_ids.map((g_id) => ({
        roomId: id,
        galleryId: g_id,
        position: ++lastImagePosition,
      }));
      try {
        const result = await tx
          .insert(roomImages)
          .values(imagePayload)
          .returning();
        return result;
      } catch (error) {
        throw new Error("Duplicated Image");
      }
    });
  }

  async deleteImage(id: string, payload: updateRoomImageType) {
    upsertRoomImageDTO.parse(payload);
    const roomResult = await this.db_
      .select()
      .from(room)
      .where(
        and(eq(room.id, id), eq(room.storeId, this.currentStore_.storeId))
      );
    if (!roomResult[0]) {
      throw new Error("Room not found");
    }

    return await this.db_.transaction(async (tx) => {
      return await tx
        .delete(roomImages)
        .where(inArray(roomImages.galleryId, payload.g_ids))
        .returning();
    });
  }

  async reorderImage(id: string, payload: updateRoomImageType) {
    const validated = upsertRoomImageDTO.parse(payload);
    const roomResult = await this.db_
      .select()
      .from(room)
      .where(
        and(eq(room.id, id), eq(room.storeId, this.currentStore_.storeId))
      );
    if (!roomResult[0]) {
      throw new Error("Room not found");
    }

    return await this.db_.transaction(async (tx) => {
      let position = 0;
      await tx.delete(roomImages).where(eq(roomImages.roomId, id));
      const imagePayload = validated.g_ids.map((g_id) => ({
        roomId: id,
        galleryId: g_id,
        position: position++,
      }));

      const result = await tx
        .insert(roomImages)
        .values(imagePayload)
        .returning();
      return result;
    });
  }
}
