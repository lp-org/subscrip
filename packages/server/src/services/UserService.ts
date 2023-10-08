import {
  NewUser,
  PgJsDatabaseType,
  User,
  activityLog,
  setting,
  store,
  storeToUser,
  user,
  userSchema,
} from "db";
import Model from "../interfaces/model";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { InferModel, getTableName, eq, and } from "drizzle-orm";
import { RESOLVER } from "awilix";
import Scrypt from "scrypt-kdf";
import PaymentGatewayService from "./PaymentGatewayService";
import { CurrentStore } from "../types";
type InjectedDependencies = {
  db: PgJsDatabaseType;
  currentUser: Express.User;
  currentStore: CurrentStore;
  paymentGatewayService: PaymentGatewayService;
};

class UserService extends Model<typeof user> {
  static [RESOLVER] = {};
  protected override readonly db_: PgJsDatabaseType;
  protected readonly currentUser_: Express.User;
  protected readonly currentStore_: CurrentStore;
  protected readonly paymentGatewayService_: PaymentGatewayService;
  constructor({
    db,
    currentUser,
    currentStore,
    paymentGatewayService,
  }: InjectedDependencies) {
    super(arguments[0], user);
    this.db_ = db;
    this.currentUser_ = currentUser;
    this.currentStore_ = currentStore;
    this.paymentGatewayService_ = paymentGatewayService;
  }

  async get(userId: string) {
    return await this.db_.transaction(async (tx) => {
      const currentStore = this.currentStore_;
      let data = await tx
        .select({
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          sCustomerId: user.sCustomerId,
          // store: {
          //   ...(currentStore ? { storeUserId: storeToUser.id } : {}),
          //   ...(currentStore ? { id: storeToUser.storeId } : {}),
          //   ...(currentStore ? { name: store.name } : {}),
          //   ...(currentStore ? { currency: setting.currency } : {}),
          // },
        })
        .from(user)
        // .leftJoin(storeToUser, eq(storeToUser.userId, user.id))
        // .leftJoin(store, eq(storeToUser.storeId, store.id))
        // .leftJoin(setting, eq(setting.storeId, store.id))

        .where(and(eq(user.id, userId)));
      if (!data[0]) {
        return undefined;
      }
      const result = { ...data[0], store: currentStore };
      return result;
    });
  }

  override async list() {
    const data = await this.db_
      .select({
        id: storeToUser.id,
        email: user.email,
      })
      .from(user)
      .leftJoin(storeToUser, eq(storeToUser.userId, user.id))
      .where(eq(storeToUser.storeId, this.currentStore_.storeId));

    return data;
  }

  async invite() {
    this.db_.transaction(async (tx) => {});
  }
}

export default UserService;
