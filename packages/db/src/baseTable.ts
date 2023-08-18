// interface DefaultFieldType {
//   id: PgSerialBuilder<{
//     name: "id";
//     data: number;
//     driverParam: number;
//     hasDefault: true;
//     notNull: true;
//   }>;
//   createdAt: PgTimestampBuilder<{
//     name: "created_at";
//     data: Date;
//     driverParam: string;
//     notNull: false;
//     hasDefault: true;
//   }>;
//   updatedAt: PgTimestampBuilder<{
//     name: "updated_at";
//     data: Date;
//     driverParam: string;
//     notNull: false;
//     hasDefault: true;
//   }>;
// }

// export const baseTable = <
//   TSchema extends string,
//   TTableName extends string,
//   TColumnsMap extends Record<string, AnyPgColumnBuilder> &
//     Partial<DefaultFieldType>
// >(
//   name: TTableName,
//   columns: TColumnsMap,

//   extraConfig?: (
//     self: BuildColumns<TTableName, TColumnsMap>
//   ) => PgTableExtraConfig
// ): PgTableWithColumns<{
//   name: TTableName;
//   schema: TSchema | undefined;
//   columns: BuildColumns<TTableName, TColumnsMap>;
// }> => {
//   return pgTable<TTableName, TColumnsMap>(
//     name,
//     {
//       ...columns,
//       id: serial("id").primaryKey(),
//       createdAt: timestamp("created_at").defaultNow(),
//       updatedAt: timestamp("updated_at").defaultNow(),
//     },
//     extraConfig
//   );
// };
