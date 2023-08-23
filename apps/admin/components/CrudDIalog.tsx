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
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveAction} />
    </>
  );
  return (
    <Dialog
      maximizable
      maximized
      visible={visible}
      style={{ width: "450px" }}
      header={header}
      modal
      className="p-fluid"
      footer={productDialogFooter}
      onHide={hideDialog}
    >
      {children}
    </Dialog>
  );
};

export default CrudDialog;
