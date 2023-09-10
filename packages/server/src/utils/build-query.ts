import {
  AnyColumn,
  SQL,
  Table,
  TableConfig,
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
} from "drizzle-orm";
import { AnyPgTable, PgTableFn, PgTableWithColumns } from "drizzle-orm/pg-core";
import { FilterType } from "../types";
import { SchemaType } from "db";

export function buildQuery<
  T extends Table<
    TableConfig<
      AnyColumn<{
        name: any;
      }>
    >
  >
>(table_: T, query: FilterType) {
  const where_: SQL[] = [];
  let orderBy_: SQL | undefined = undefined;
  let with_: Record<string, unknown> = {};
  let limit = 50;
  let offset = 0;

  if ("expands" in query) {
    query.expands?.forEach((e) => {
      with_[e] = true;
    });
  }

  if ("where" in query) {
    query.where?.forEach((f) => {
      if (f[1] === "=") {
        // @ts-ignore
        where_.push(eq(table_[f[0]], f[2]));
      } else if (f[1] === "like") {
        // @ts-ignore
        where_.push(ilike(table_[f[0]], `%${f[2]}%`));
      }
    });
  }
  if ("orderBy" in query) {
    const orderBy = query.orderBy;
    if (orderBy?.column) {
      orderBy_ =
        orderBy?.type === "ASC"
          ? // @ts-ignore
            asc(table_[orderBy?.column])
          : // @ts-ignore
            desc(table_[orderBy?.column]);
    }
  }

  if ("limit" in query) {
    limit = query.limit || 50;
  }

  if ("offset" in query) {
    offset = query.offset || 0;
  }

  return {
    where: and(...where_),
    orderBy: orderBy_,
    with: with_,
    limit,
    offset,
  };
}

export function whereEqQuery(
  filter: Record<string, unknown> | undefined,
  table_: ReturnType<PgTableFn>
) {
  const where: SQL[] = [];
  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      if (typeof value === "string" && value.includes(",")) {
        const inValue = value.split(",");
        where.push(inArray(table_[key], inValue));
      } else where.push(eq(table_[key], value));
    }
  }

  return where;
}
