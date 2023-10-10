import { DataTableStateEvent } from "primereact/datatable";
import { ToastMessage } from "primereact/toast";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
export type FILTER = "room" | "booking";
import { produce } from "immer";
import { FilterMatchMode, FilterOperator } from "primereact/api";
interface useAdminPersistStoreState {
  tableFilter: Record<FILTER, Partial<DataTableStateEvent> | undefined>;
  setTableFilter: (key: FILTER, f: DataTableStateEvent) => void;
}

export const useAdminPersistStore = create<useAdminPersistStoreState>()(
  persist(
    immer((set) => ({
      tableFilter: {
        room: {
          filters: {
            name: {
              operator: FilterOperator.AND,
              constraints: [
                { value: null, matchMode: FilterMatchMode.STARTS_WITH },
              ],
            },
            status: {
              operator: FilterOperator.AND,
              constraints: [
                { value: "published", matchMode: FilterMatchMode.EQUALS },
              ],
            },
            quantity: {
              operator: FilterOperator.AND,
              constraints: [
                { value: 0, matchMode: FilterMatchMode.GREATER_THAN },
              ],
            },
          },
        },
        booking: undefined,
      },
      setTableFilter: (key, f) =>
        set(
          produce((state) => {
            console.log(f);
            // return { tableFilter: { ...state.tableFilter, [key]: f } };
            state.tableFilter[key] = { ...f };
          })
        ),
    })),
    { name: "persist-storage" }
  )
);
