import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import React, { useMemo, useState } from "react";
import { useRequest } from "../utils/adminClient";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "ui";
import { confirmDialog } from "primereact/confirmdialog";
import { Gallery } from "db";

interface GalleryDialogType {
  onSelectedFile: (e: Gallery[]) => void;
  visible: boolean;
  onHide: () => void;
  multiple?: boolean;
}

const GalleryDialog = ({
  visible,
  onHide,
  onSelectedFile,
  multiple,
}: GalleryDialogType) => {
  const { adminClient } = useRequest();
  const [checkedFile, setCheckedFile] = useState<{
    [fileKey: string]: boolean;
  }>({});
  const closeDialog = () => {
    onHide();
    setCheckedFile({});
  };
  const checkedFileArr = useMemo(
    () => Object.keys(checkedFile).filter((key) => checkedFile[key] === true),
    [checkedFile]
  );
  const { showToast } = useToast();
  const { data } = useQuery({
    queryFn: adminClient.gallery.list,
    queryKey: ["galleryList"],
  });
  const queryClient = useQueryClient();
  const { mutate: deleteMutate } = useMutation({
    mutationFn: adminClient.gallery.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["galleryList"]);
      showToast({
        severity: "success",
        detail: "Image Deleted Successfully",
      });
      setCheckedFile({});
    },
  });
  const galleryList = data?.data?.gallery;
  return (
    <Dialog
      style={{ width: "600px" }}
      header={
        !!checkedFileArr.length && (
          <Button
            type="button"
            icon="pi pi-trash"
            severity="secondary"
            onClick={() => {
              confirmDialog({
                message:
                  "Deleting these image files may affect their availability for other records. Are you sure you want to continue?",
                header: "Confirmation",
                icon: "pi pi-exclamation-triangle",
                accept: () => deleteMutate({ fileKey: checkedFileArr }),
              });
            }}
          />
        )
      }
      footer={
        <Button
          type="button"
          onClick={() => {
            onSelectedFile(
              galleryList?.filter((el) =>
                checkedFileArr.includes(el.fileKey)
              ) || []
            );
            closeDialog();
          }}
        >
          Confirm
        </Button>
      }
      onHide={closeDialog}
      visible={visible}
    >
      <div className="grid gap-2 overflow-y-scroll border p-4">
        {galleryList?.map((el, i) => (
          <div key={el.id} className="relative col-3">
            <Image
              className="w-full h-8rem object-cover "
              width={100}
              height={100}
              src={el.url!}
              alt={el.id!}
            />
            <Checkbox
              checked={checkedFile[el.fileKey!] || false}
              className="absolute right-0 top-0 m-2 bg-white"
              onChange={(e) => {
                setCheckedFile((prev) =>
                  multiple
                    ? {
                        ...prev,
                        [el.fileKey!]: !!e.checked,
                      }
                    : { [el.fileKey!]: !!e.checked }
                );
              }}
            />
          </div>
        ))}
      </div>
      <div>{`${checkedFileArr.length} files is selected`}</div>
    </Dialog>
  );
};

export default GalleryDialog;
