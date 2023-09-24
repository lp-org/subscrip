import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import React, { useRef, useState } from "react";
import { useRequest } from "../utils/adminClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMobileView, useToast } from "ui";
import GalleryDialog from "./GalleryDialog";
import { Image } from "primereact/image";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { classNames } from "primereact/utils";
import { Panel } from "primereact/panel";
import { Gallery } from "db";

interface UploadAreaType {
  title?: string;
  maxFileCount?: number;
  multiple?: boolean;
  onImagesChange?: (e: Gallery[]) => void;
  onNewImagesChange?: (e: Gallery[]) => void;
  onDeleteImage?: (e: Gallery[]) => void;
  images?: Gallery[];
  isLoading?: boolean;
}
let id = 1;
const UploadArea = ({
  title,
  maxFileCount = 10,
  multiple = true,
  onImagesChange,
  onNewImagesChange,
  onDeleteImage,
  images,
  isLoading = false,
}: UploadAreaType) => {
  const { adminClient } = useRequest();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const fileRef = useRef(null);

  const { mutate } = useMutation({
    mutationFn: adminClient.gallery.upload,
    onSuccess: (res) => {
      // showToast({ severity: "success", detail: "Upload Success" });
      queryClient.invalidateQueries(["galleryList"]);
      setItems((prev) => [
        ...prev.map((el) => ({ ...el, id: el.id })),
        ...res.data,
      ]);
      onNewImagesChange && onNewImagesChange(res.data);
    },
  });
  const [galleryDialogVisibe, setGalleryDialogVisibe] = useState(false);

  const [items, setItems] = useState<Gallery[]>(images || []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,

        tolerance: 500,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active && over) {
      if (active.id !== over.id) {
        const oldIndex = items.findIndex(({ id }) => id === active.id);
        const newIndex = items.findIndex(({ id }) => id === over.id);

        const sortedArray = arrayMove(items, oldIndex, newIndex);
        setItems(sortedArray);
        onImagesChange && onImagesChange(sortedArray);
      }
    }
  }

  const handleUpload = (files: File[]) => {
    const existingImageCount = items.length;
    const uploadImageCount = files.length;
    if (existingImageCount + uploadImageCount > maxFileCount) {
      showToast({
        severity: "error",
        detail: `You can only upload up to ${maxFileCount} images`,
      });
      return;
    }

    mutate(files);
  };

  const [dragging, setDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    // Access the dropped files from the event data transfer object (e.dataTransfer)
    const droppedFiles: File[] = Array.from(e.dataTransfer.files);

    handleUpload(droppedFiles);
    // You can now process the dropped files as needed
  };
  const isMobile = useMobileView();

  return (
    <Panel
      header={
        <>
          <div className="flex-col">
            <div>{title}</div>
            <div className="text-xs font-light mt-1">
              Max: {maxFileCount} images
            </div>
          </div>
          <div className="flex flex-row gap-4 ml-auto">
            <FileUpload
              mode="basic"
              multiple={multiple}
              accept="image/*"
              maxFileSize={1000000}
              auto
              uploadHandler={(e) => {
                handleUpload(e.files);
                e.options.clear();
              }}
              customUpload
              ref={fileRef}
            />
            <Button
              label={!isMobile ? "Choose From Gallery" : undefined}
              severity="secondary"
              size="small"
              icon="pi pi-images"
              type="button"
              onClick={() => setGalleryDialogVisibe(true)}
            />
          </div>
        </>
      }
      className="mt-4"
      pt={{
        title: { className: "flex w-full align-items-center" },
        header: {
          className: "py-3",
        },
      }}
    >
      {isLoading ? (
        <>Loading</>
      ) : (
        <div>
          {items.length && !dragging ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div
                className="flex flex-row gap-2 flex-wrap"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <SortableContext items={items} strategy={rectSortingStrategy}>
                  {items.map((el, i) => (
                    <SortableItem
                      key={el.id}
                      id={el.id}
                      className={classNames(
                        "border-gray-300 border-1 border-round p-0 relative w-10rem"
                      )}
                      parentStyle={(index) => {
                        return i === 0
                          ? {
                              //   gridRowStart: "span 2",
                              //   gridColumnStart: "span 3",
                            }
                          : {};
                      }}
                    >
                      <Image
                        style={{
                          alignItems: "center",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          maskImage: "radial-gradient(#fff,#000)",
                          overflow: "hidden",
                          transform: "translateZ(0)",
                          width: "100%",
                          height: "100%",
                        }}
                        src={el.url}
                        alt={`${el.id}`}
                        preview
                        height={"100"}
                        imageClassName="block  max-w-full max-h-full"
                      />

                      <Button
                        type="button"
                        icon="pi pi-trash"
                        size="small"
                        className="absolute top-0 right-0 w-2 h-2"
                        severity="secondary"
                        link
                        onClick={() => {
                          const temp = [...items];
                          const deletedGallery = temp.splice(i, 1);

                          onDeleteImage && onDeleteImage(deletedGallery);
                          setItems(temp);
                        }}
                      ></Button>
                    </SortableItem>
                  ))}
                </SortableContext>
              </div>
            </DndContext>
          ) : (
            <div
              className="flex align-items-center flex-column"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <i
                className="pi pi-image mt-3 p-5"
                style={{
                  fontSize: "5em",
                  borderRadius: "50%",
                  backgroundColor: "var(--surface-b)",
                  color: "var(--surface-d)",
                }}
              ></i>
              <span
                style={{
                  fontSize: "1.2em",
                  color: "var(--text-color-secondary)",
                }}
                className="my-5"
              >
                Drag and Drop Image Here
              </span>
            </div>
          )}
          {/* <div className="absolute top-0 left-0 h-full w-full"></div> */}
        </div>
      )}

      <GalleryDialog
        multiple={multiple}
        onHide={() => setGalleryDialogVisibe(false)}
        visible={galleryDialogVisibe}
        onSelectedFile={(e) => {
          if (e.length + items.length > 10) {
            showToast({
              severity: "error",
              detail: `You can only upload up to ${maxFileCount} images`,
            });
            return;
          }
          setItems((prev) => [...prev, ...e.map((el) => ({ ...el }))]);

          onNewImagesChange && onNewImagesChange(e);
        }}
      />
    </Panel>
  );
};

export default UploadArea;
