/* eslint-disable @next/next/no-img-element */
"use client";
import { useQuery } from "@tanstack/react-query";
import { NewUser, User } from "db";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {} from "ui";
import CrudDialog from "../../../../../components/CrudDIalog";
import DeleteDialog from "../../../../../components/DeleteDialog";
import { useToast } from "ui";
import { useRequest } from "../../../../../utils/adminClient";
import InputError from "ui/InputError";
type UserType = Partial<User>;
const Crud = () => {
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState<UserType>();
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const { showToast } = useToast();
  const dt = useRef<DataTable<UserType[]>>(null);
  const { adminClient } = useRequest();
  const { data, isLoading } = useQuery({
    queryFn: adminClient.user.get,
    queryKey: ["userGet"],
  });
  const products = data?.data;

  const { register, watch, formState } = useForm<NewUser>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const product = watch();

  const openNew = () => {
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(undefined);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = () => {
    console.log(product);
  };

  const editProduct = (data: UserType) => {
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product: User) => {
    setDeleteProductDialog(product);
  };

  const deleteProduct = () => {
    showToast({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    showToast({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000,
    });
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="New"
            icon="pi pi-plus"
            severity="success"
            className=" mr-2"
            onClick={openNew}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedProducts || !selectedProducts.length}
          />
        </div>
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload
          mode="basic"
          accept="image/*"
          maxFileSize={1000000}
          chooseLabel="Import"
          className="mr-2 inline-block"
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          severity="help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (rowData: UserType) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          severity="success"
          className="mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          severity="warning"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Products</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.currentTarget.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toolbar
            className="mb-4"
            start={leftToolbarTemplate}
            end={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            loading={isLoading}
            ref={dt}
            value={products}
            selection={selectedProducts}
            onSelectionChange={(e) =>
              setSelectedProducts(e.value as UserType[])
            }
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            globalFilter={globalFilter}
            emptyMessage="No products found."
            header={header}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "4rem" }}
            ></Column>
            <Column
              field="email"
              header="Email"
              headerStyle={{ minWidth: "15rem" }}
            ></Column>

            <Column
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>
          <CrudDialog
            hideDialog={hideDialog}
            saveAction={saveProduct}
            visible={productDialog}
          >
            <div className="field">
              <label htmlFor="name">Email</label>
              <InputText
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !product.email,
                })}
                {...register("email")}
              />
              <InputError errors={formState.errors} name="email" />
            </div>
          </CrudDialog>

          <DeleteDialog
            selectedLabel={(e) => e?.email}
            deleteAction={deleteProduct}
            hideDialog={hideDeleteProductDialog}
            selected={deleteProductDialog}
          />

          <DeleteDialog
            visible={deleteProductsDialog}
            deleteAction={deleteSelectedProducts}
            hideDialog={hideDeleteProductsDialog}
          />
        </div>
      </div>
    </div>
  );
};

export default Crud;
