import React from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import {useRouter} from "next/navigation"

type FormToolbarProps = {
    backUrl ?: string
}

const FormToolbar = ({backUrl}: FormToolbarProps) => {
    const router = useRouter()
  return (
    <Toolbar
      end={<Button type="submit"> Save</Button>}
      start={<Button icon="pi pi-angle-left" type="button" link onClick={()=>{backUrl ? router.push(backUrl):router.back()}} />}
    ></Toolbar>
  );
};

export default FormToolbar;
