import {
  NewRoom,
  PgJsDatabaseType,
  room,
  roomImages,
  roomSchema,
  store,
} from "db";
import { RESOLVER } from "awilix";
import {
  InferModel,
  and,
  asc,
  desc,
  eq,
  getTableName,
  inArray,
} from "drizzle-orm";
import { CurrentStore } from "../types";
import { BaseService } from "../interfaces/base-service";
import GalleryService from "./GalleryService";
import {
  createRoomType,
  updateRoomDTO,
  updateRoomImageType,
  updateRoomType,
  upsertRoomImageDTO,
} from "utils-data";

type InjectedDependencies = {
  db: PgJsDatabaseType;
  currentStore: CurrentStore;
  galleryService: GalleryService;
};

type BuildQueryType = {
  offset?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
};

type NewRoomType = typeof room.$inferInsert;
type RoomType = typeof room.$inferSelect;
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

  async list(filter: any) {
    // const currentStore = this.currentStore_;
    // return await this.db_.transaction(async (tx) => {
    //   const result = await tx.query.store.findMany({
    //     columns: {},
    //     with: {
    //       room: {
    //         limit: 10,
    //       },
    //     },
    //     where: eq(store.id, currentStore.storeId),
    //   });
    //   return result[0];
    // });

    // return await this.db_.query.room.findMany({
    //   with: {
    //     images: {
    //       with: {
    //         gallery: {
    //           columns: { fileKey: true, id: true },
    //         },
    //       },
    //       columns: {
    //         roomId: false,
    //         galleryId: false,
    //       },

    //       orderBy: asc(roomImages.position),
    //     },
    //   },
    // });

    return await this.listByStore(filter, room, {
      pricings: true,
      images: {
        with: {
          gallery: true,
        },
        columns: {
          roomId: false,
          galleryId: false,
        },

        orderBy: asc(roomImages.position),
      },
    });
  }

  async create(payload: createRoomType) {
    const currentStore = this.currentStore_;
    roomSchema.parse(payload);
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
      const newRoomImages = payload.images.map((el, i) => ({
        roomId: roomData[0].id,
        galleryId: el,
        position: i,
      }));

      await tx.insert(roomImages).values(newRoomImages);

      return roomData[0];
    });
  }

  async get(id: string) {
    const currentStore = this.currentStore_;
    const data = await this.db_.query.room.findFirst({
      with: {
        images: {
          with: {
            gallery: true,
          },
          orderBy: asc(roomImages.position),
        },
      },
      where: and(eq(room.id, id), eq(room.storeId, currentStore.storeId)),
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
