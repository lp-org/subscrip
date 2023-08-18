import { type AnyPgTable } from "drizzle-orm/pg-core";

import { AnyColumn, Table, TableConfig, getTableName } from "drizzle-orm";
import { PgJsDatabaseType, SchemaType, user } from "db";
import { buildQuery } from "../utils/build-query";
import { FilterType } from "../types";

type TTable = Pick<PgJsDatabaseType, "query">;

export default abstract class Model<
  T extends Table<TableConfig<AnyColumn<{}>>>
> {
  protected readonly db_: PgJsDatabaseType;
  protected readonly table_: T;
  protected constructor(
    protected readonly db: PgJsDatabaseType,
    protected readonly table: T
  ) {
    this.db_ = db;
    this.table_ = table;
  }
  async list(filter: FilterType) {
    const tableName = getTableName(this.table_) as keyof TTable["query"];
    // @ts-ignore
    const data = await this.db_.query[tableName].findMany(
      buildQuery(this.table_, filter)
    );

    // const count = await this.db_
    //   .select({ count: sql<number>`count(*)` })
    //   .from(this.table_)
    //   .where(and.apply(this, filter));

    return data;
  }
}
