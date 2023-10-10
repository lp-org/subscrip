import React from "react";
import * as PrimitiveDataTable from "primereact/datatable";
import * as PrimitiveColumn from "primereact/column";

// const DataTable = PrimitiveDataTable.DataTable;

const DataTable = React.forwardRef<
  React.ElementRef<typeof PrimitiveDataTable.DataTable>,
  React.ComponentPropsWithoutRef<typeof PrimitiveDataTable.DataTable>
>(({ className, ...props }, ref) => (
  <PrimitiveDataTable.DataTable
    ref={ref}
    {...props}
    rowsPerPageOptions={[10, 25, 50]}
    {...(props.onRowClick && {
      onRowClick: (e) => {
        if (props?.onRowClick) {
          // @ts-ignore
          const tagName = e.originalEvent.target.tagName;
          if (tagName === "svg" || tagName === "path") {
            return;
          }
          return props?.onRowClick(e);
        }
      },
    })}
  />
));

DataTable.displayName = PrimitiveDataTable.DataTable.name;

const Column = React.forwardRef<
  React.ElementRef<typeof PrimitiveColumn.Column>,
  React.ComponentPropsWithoutRef<typeof PrimitiveColumn.Column>
>(({ className, ...props }, ref) => (
  <PrimitiveColumn.Column ref={ref} {...props} />
));

Column.displayName = PrimitiveColumn.Column.name;

export { DataTable, Column };
