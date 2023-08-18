import { PgJsDatabaseType, setting, user } from "db";
import Model from "../interfaces/model";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { getTableName } from "drizzle-orm";
import { RESOLVER } from "awilix";
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
    // console.log(currentUser);
  }
}

export default UserService;
