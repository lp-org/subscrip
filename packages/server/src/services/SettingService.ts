import { PgJsDatabaseType, setting } from "db";
import Model from "../interfaces/model";
import { RESOLVER } from "awilix";
type InjectedDependencies = {
  db: PgJsDatabaseType;
};

class SettingService extends Model<typeof setting> {
  static [RESOLVER] = {};
  protected override readonly db_: PgJsDatabaseType;

  constructor({ db }: InjectedDependencies) {
    super(arguments[0], setting);
    this.db_ = db;
  }
}

export default SettingService;
