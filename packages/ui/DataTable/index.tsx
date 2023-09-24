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

const Column = PrimitiveColumn.Column;
export { DataTable, Column };
