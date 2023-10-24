import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface CrudDialogProps {
  header?: string;
  children: React.ReactNode;
  visible: boolean;

  hideDialog: () => void;
  saveAction: () => void;
}

const CrudDialog = ({
  header,
  visible,
  hideDialog,
  saveAction,
  children,
}: CrudDialogProps) => {
  const productDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        onClick={hideDialog}
        type="button"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        text
        onClick={saveAction}
        type="submit"
      />
    </>
  );
  return (
    <Dialog
      maximizable
      visible={visible}
      header={header}
      modal
      className="p-fluid"
      footer={productDialogFooter}
      onHide={hideDialog}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      {children}
    </Dialog>
  );
};

export default CrudDialog;
