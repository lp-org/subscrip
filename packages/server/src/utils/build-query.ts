import {
  AnyColumn,
  AnyTable,
  Column,
  InferModel,
  InferSelectModel,
  SQL,
  Table,
  TableConfig,
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  gt,
  gte,
  ilike,
  inArray,
  is,
  lt,
  lte,
  ne,
  or,
  sql,
} from "drizzle-orm";
import { AnyPgTable, PgTableFn, PgTableWithColumns } from "drizzle-orm/pg-core";
import { FilterType } from "../types";
import { SchemaType, gallery, room, roomImages, store } from "db";
import { ListFilter } from "utils-data";

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
      } else if (key === "q") {
        if (typeof value === "object") {
          if (!Array.isArray(value)) {
            throw new Error("query need to be array");
          }
          where.push(ilike(table_[value[0]], `%${value[1]}%`));
        }
      } else where.push(eq(table_[key], value));
    }
  }

  return where;
}

export function whereFilter(
  filter: Record<string, any> | undefined,
  table_: ReturnType<PgTableFn>
) {
  const where: SQL[] = [];

  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      if (value?.constraints?.length && is(table_[key], Column)) {
        const where_: SQL[] = [];
        value?.constraints.forEach((cons: any) => {
          if (cons.value) {
            if (cons.matchMode === "startsWith")
              where_.push(ilike(table_[key], `${cons.value}%`));
            else if (cons.matchMode === "endWith")
              where_.push(ilike(table_[key], `%${cons.value}`));
            else if (cons.matchMode === "equals")
              where_.push(eq(table_[key], cons.value));
            else if (cons.matchMode === "gt")
              where_.push(gt(table_[key], cons.value));
            else if (cons.matchMode === "lt")
              where_.push(lt(table_[key], cons.value));
            else if (cons.matchMode === "gte")
              where_.push(gte(table_[key], cons.value));
            else if (cons.matchMode === "lte")
              where_.push(lte(table_[key], cons.value));
            else if (cons.matchMode === "notEqual")
              where_.push(ne(table_[key], cons.value));
          }
        });
        const operator = value.operator === "and" ? and : or;
        const fieldWhere = operator(...where_);
        if (fieldWhere) {
          where.push(fieldWhere);
        }
      }
    }
  }

  return where;
}

export function pageConfig(payload: ListFilter) {
  let limit = 10;
  let offset = 0;
  if (payload.first) {
    limit = parseInt(payload?.rows || "10");
  }
  if (payload.first) {
    offset = parseInt(payload?.first || "0");
  }
  return {
    limit,
    offset,
  };
}

export function jsonAgg<Table extends AnyTable<TableConfig>>(
  table: Table,
  orderBy?: SQL<unknown>
) {
  return sql<
    InferSelectModel<Table>[]
    // @ts-ignore
  >`coalesce(json_agg(${table} ${orderBy}) filter (where ${table["id"]} is not null), '[]')`;
}
