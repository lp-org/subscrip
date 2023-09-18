import { CustomerType, NewCustomerType, PgJsDatabaseType, customer } from "db";
import { RESOLVER } from "awilix";
import { BaseService } from "../interfaces/base-service";
import { CurrentStore } from "../types";
type InjectedDependencies = {
  db: PgJsDatabaseType;
  currentStore: CurrentStore;
};

export default class CustomerService extends BaseService {
  static [RESOLVER] = {};
  protected override readonly db_: PgJsDatabaseType;
  protected override readonly currentStore_: CurrentStore;
  constructor({ db, currentStore }: InjectedDependencies) {
    super({ db, currentStore });
    this.db_ = db;
    this.currentStore_ = currentStore;
  }

  async list(filter: CustomerType) {
    const data = await this.listByStore(filter, customer);
    return data;
  }

  async create(payload: NewCustomerType) {
    const currentStore = this.currentStore_;
    return await this.db_.transaction(async (tx) => {
      return await tx
        .insert(customer)
        .values({ ...payload, storeId: currentStore.storeId });
    });
  }
}
