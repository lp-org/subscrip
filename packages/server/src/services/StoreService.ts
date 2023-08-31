import { PgJsDatabaseType, User, store, storeToUser, user } from "db";
import { RESOLVER } from "awilix";
import { InferModel, and, eq } from "drizzle-orm";
type InjectedDependencies = {
  db: PgJsDatabaseType;
  currentUser: any;
};

type UpdateStore = InferModel<typeof store, "insert">;

export default class StoreService {
  static [RESOLVER] = {};
  protected readonly db_: PgJsDatabaseType;
  protected readonly currentUser_: any;
  constructor({ db, currentUser }: InjectedDependencies) {
    this.db_ = db;
    this.currentUser_ = currentUser;
  }

  async list() {
    return await this.db_.transaction(async (tx) => {
      const storeUser = await tx
        .select()
        .from(store)
        .innerJoin(storeToUser, eq(storeToUser.storeId, store.id))
        .where(eq(storeToUser.userId, this.currentUser_.userId));

      return storeUser.map(({ store }) => store);
    });
  }
  async get(storeId: string) {
    return await this.db_.transaction(async (tx) => {
      const storeUser = await tx
        .select({
          storeId: store.id,
          storeUserId: storeToUser.id,
        })
        .from(store)
        .innerJoin(storeToUser, eq(storeToUser.storeId, store.id))
        .where(
          and(
            eq(storeToUser.userId, this.currentUser_.userId),
            eq(storeToUser.storeId, storeId)
          )
        );
      return storeUser[0];
    });
  }

  async create(name: string) {
    return await this.db_.transaction(async (tx) => {
      const newStore = await tx
        .insert(store)
        .values({
          name,
        })
        .returning({
          id: store.id,
        });
      const storeUser = await tx
        .insert(storeToUser)
        .values({
          storeId: newStore[0].id,
          userId: this.currentUser_.userId,
        })
        .returning({
          id: storeToUser.storeId,
          storeUserId: storeToUser.id,
        });
      return storeUser[0];
    });
  }

  async update(payload: UpdateStore) {
    const data = await this.db_.insert(store).values({
      name: payload.name,
      active: payload.active,
      updatedAt: new Date(),
    });

    return data[0];
  }
}
