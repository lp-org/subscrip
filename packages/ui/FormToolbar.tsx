"use client";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

type FormToolbarProps = {
  backUrl?: string;
  title?: string;
};

const FormToolbar = ({ backUrl, title }: FormToolbarProps) => {
  const router = useRouter();
  return (
    <Toolbar
      end={<Button type="submit"> Save</Button>}
      start={
        <div className="flex flex-row align-items-center">
          <Button
            icon="pi pi-angle-left"
            type="button"
            link
            onClick={() => {
              backUrl ? router.push(backUrl) : router.back();
            }}
          />
          <div className="ml-2 font-bold text-xl">{title}</div>
        </div>
      }
    ></Toolbar>
  );
};

export default FormToolbar;
