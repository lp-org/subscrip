import React, { useState, useEffect } from "react";
import { OrderList as PrimitiveOrderList } from "primereact/orderlist";
import { Checkbox } from "primereact/checkbox";

interface expandOrderListType {
  checkbox?: boolean;
  selectedValue?: string[];
  setSelectedValue?: (e: string[]) => void;
}
const OrderList = React.forwardRef<
  React.ElementRef<typeof PrimitiveOrderList>,
  React.ComponentPropsWithoutRef<typeof PrimitiveOrderList> &
    expandOrderListType
>(({ selectedValue, setSelectedValue, ...props }, ref) => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const itemTemplate = (id: string) => {
    return (
      <div className="flex flex-wrap p-2 align-items-center gap-3">
        {props.checkbox && selectedValue && setSelectedValue && (
          <Checkbox
            checked={selected[id]}
            onChange={(e) => {
              setSelected((prev) => ({
                ...prev,
                [id]: e.checked || false,
              }));
            }}
          />
        )}
        {props.itemTemplate && props.itemTemplate(id)}
      </div>
    );
  };

  useEffect(() => {
    if (setSelectedValue) {
      const trueKeys = [];
      for (const key in selected) {
        if (selected[key] === true) {
          trueKeys.push(key);
        }
      }
      setSelectedValue(trueKeys);
    }
  }, [selected]);
  return (
    <PrimitiveOrderList
      ref={ref}
      {...props}
      itemTemplate={itemTemplate}
    ></PrimitiveOrderList>
  );
});
OrderList.displayName = PrimitiveOrderList.name;
export default OrderList;
