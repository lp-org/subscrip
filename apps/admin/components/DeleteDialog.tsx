import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";

type SelectedProps = { [x: string]: unknown } | { [x: string]: unknown }[];

interface CrudDialogProps<T extends SelectedProps> {
  visible?: boolean;
  header?: string;
  selectedLabel?: (e: T) => string;
  selected?: T;
  hideDialog: () => void;
  deleteAction: () => void;
}

const DeleteDialog = <T extends SelectedProps>({
  visible,
  selected,
  hideDialog,
  deleteAction,
  selectedLabel,
}: CrudDialogProps<T>) => {
  visible = selected ? !!selected : visible;
  const deleteDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteAction} />
    </>
  );
  return (
    <Dialog
      visible={visible}
      style={{ width: "450px" }}
      header="Confirm"
      modal
      footer={deleteDialogFooter}
      onHide={hideDialog}
    >
      <div className="flex align-items-center justify-content-center">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {Array.isArray(selected) ? (
          <span>Are you sure you want to delete selected records?</span>
        ) : (
          <span>
            Are you sure you want to delete{" "}
            <b>
              {selectedLabel
                ? selectedLabel(selected)
                : (selected?.name as string)}
            </b>
            ?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default DeleteDialog;
