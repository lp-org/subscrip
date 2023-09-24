import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { GripHorizontal, GripVertical } from "lucide-react";

type SortableItemType = {
  id: string | number;
  children?: React.ReactNode;
  className?: string;
  parentStyle?: (i: number) => React.CSSProperties;
};

export function SortableItem({
  id,
  children,
  className,
  parentStyle,
}: SortableItemType) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    activeIndex,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={
        parentStyle ? { ...style, ...parentStyle(activeIndex) } : { ...style }
      }
      {...{ className: classNames(className, "relative") }}
    >
      <div
        className="absolute z-5 m-2 cursor-move top-0 left-0 bg-gray-100 opacity-50 border-round"
        {...attributes}
        {...listeners}
        style={{ touchAction: "none" }}
      >
        <GripVertical className=" m-2" />
      </div>
      {children}
    </div>
  );
}
