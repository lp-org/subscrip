import { PgJsDatabaseType, store } from "db";
import Model from "../interfaces/model";
import { RESOLVER } from "awilix";
type InjectedDependencies = {
  db: PgJsDatabaseType;
};
export default class StoreService extends Model<typeof store> {
  static [RESOLVER] = {};
  protected override readonly db_: PgJsDatabaseType;
  constructor({ db }: InjectedDependencies) {
    super(arguments[0], store);
    this.db_ = db;
  }

  async get() {}
}
