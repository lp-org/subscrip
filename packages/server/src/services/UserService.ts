import {
  NewUser,
  PgJsDatabaseType,
  User,
  activityLog,
  setting,
  storeToUser,
  user,
  userSchema,
} from "db";
import Model from "../interfaces/model";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { InferModel, getTableName, eq } from "drizzle-orm";
import { RESOLVER } from "awilix";
import Scrypt from "scrypt-kdf";
type InjectedDependencies = {
  db: PgJsDatabaseType;
  currentUser: number;
};

class UserService extends Model<typeof user> {
  static [RESOLVER] = {};
  protected override readonly db_: PgJsDatabaseType;
  protected readonly currentUser_: number;
  constructor({ db, currentUser }: InjectedDependencies) {
    super(arguments[0], user);
    this.db_ = db;
    this.currentUser_ = currentUser;
  }

  async create(data: NewUser, password: string) {
    userSchema.parse(data);

    const hashedPassword = await this.hashPassword_(password);

    return await this.db_.transaction(async (tx) => {
      const hasUser = await this.db_
        .select()
        .from(user)
        .where(eq(user.email, data.email));
      if (hasUser[0]) {
        throw new Error("Email already exist");
      }
      const result = await tx
        .insert(user)
        .values({
          email: data.email,
          password: hashedPassword,
        })
        .returning({
          id: user.id,
        });

      return result[0];
    });
  }

  async get(userId: string) {
    return await this.db_.transaction(async (tx) => {
      const data = await tx
        .select({
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        })
        .from(user)
        .where(eq(user.id, userId));

      return data[0];
    });
  }

  override async list() {
    const data = await this.db_
      .select()
      .from(user)
      .leftJoin(storeToUser, eq(storeToUser.userId, user.id))
      .where(eq(storeToUser.storeId, "1"));

    return data;
  }

  async invite() {
    this.db_.transaction(async (tx) => {});
  }

  /**
   * Hashes a password
   * @param {string} password - the value to hash
   * @return {string} hashed password
   */
  async hashPassword_(password: string): Promise<string> {
    const buf = await Scrypt.kdf(password, { logN: 1, r: 1, p: 1 });
    return buf.toString("base64");
  }
}

export default UserService;
