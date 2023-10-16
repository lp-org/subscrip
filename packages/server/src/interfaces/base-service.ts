import { PgJsDatabaseType, room, store } from "db";
import { Column, SQL, Table, and, eq, getTableName, sql } from "drizzle-orm";
import {
  AnyPgSelect,
  PgSelect,
  PgSelectQueryBuilder,
  PgTableFn,
} from "drizzle-orm/pg-core";
import { whereEqQuery } from "../utils/build-query";
import { CurrentStore } from "../types";
import { PageConfig } from "utils-data";
type InjectedDependencies = {
  db: PgJsDatabaseType;
  currentStore: CurrentStore;
};

export abstract class BaseService {
  protected readonly db_: PgJsDatabaseType;

  protected readonly currentStore_: CurrentStore;
  constructor({ db, currentStore }: InjectedDependencies) {
    this.db_ = db;
    this.currentStore_ = currentStore;
  }

  async listByStore<T extends Table>(
    filter: Record<string, unknown>,
    table: T,
    withRelation?: Record<string, unknown>,
    pageConfig?: PageConfig
  ) {
    const tableName = getTableName(table);
    const currentStore = this.currentStore_;

    const where = and(...whereEqQuery(filter, table));

    return await this.db_.transaction(async (tx) => {
      const result = await tx.query.store.findMany({
        columns: {},
        with: {
          [tableName]: {
            where,
            limit: pageConfig?.limit,
            offset: pageConfig?.offset,
            with: withRelation,
          },
        },
        where: eq(store.id, currentStore.storeId),
      });
      const count = await this.listCountByStore(where, table);

      return { ...result[0], count };
    });
  }

  async listCountByStore<T extends Table>(where: SQL | undefined, table: T) {
    if (!("storeId" in table)) {
      throw new Error("No store_id column");
    }
    const currentStore = this.currentStore_;
    const [count] = await this.db_
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(table)

      .where(and(where, eq(table.storeId as Column, currentStore.storeId)));

    return count.count;
  }

  whereEqQueryByStore(
    filter: Record<string, unknown> | undefined,
    table_: ReturnType<PgTableFn>
  ) {
    const currentStore = this.currentStore_;
    return whereEqQuery({ ...filter, storeId: currentStore.storeId }, table_);
  }

  whereByStore(table_: ReturnType<PgTableFn>) {
    const currentStore = this.currentStore_;
    return eq(table_.storeId as Column, currentStore.storeId);
  }

  paginate<T extends AnyPgSelect>(query: T, pageConfig?: PageConfig) {
    if (pageConfig?.offset !== undefined && pageConfig?.limit !== undefined) {
      return query.offset(pageConfig?.offset).limit(pageConfig?.limit);
    }
    return query;
  }
}
