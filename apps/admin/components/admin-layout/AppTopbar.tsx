/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { classNames } from "primereact/utils";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { AppTopbarRef } from "./types/types";
import { LayoutContext } from "./context/layoutcontext";
import { Menu } from "primereact/menu";
import { useToast } from "ui";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import useAdminUser from "../../utils/use-admin-user";
import { Avatar } from "primereact/avatar";
import { useRequest } from "../../utils/adminClient";
import Image from "next/image";
import Logo from "../logo/logo";
import { useAdminRouter } from "../../utils/use-admin-router";
const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const profileMenu = useRef(null);
  const router = useRouter();
  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));
  const {
    data: { data: me },
  } = useAdminUser();

  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { adminClient } = useRequest();
  const { mutate } = useMutation({
    mutationFn: adminClient.auth.logout,
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
      showToast({
        severity: "success",
        detail: "Logout",
      });
      router.refresh();
    },
  });
  const handleLogout = () => mutate();
  const { push } = useAdminRouter();
  return (
    <div className="layout-topbar">
      <div
        onClick={() => push("/dashboard")}
        className="layout-topbar-logo cursor-pointer"
      >
        <Logo isDark={layoutConfig.colorScheme === "light" ? false : true} />
      </div>

      <button
        ref={menubuttonRef}
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars" />
      </button>

      <button
        ref={topbarmenubuttonRef}
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={showProfileSidebar}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <div
        ref={topbarmenuRef}
        className={classNames("layout-topbar-menu", {
          "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
        })}
      >
        {/* <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-calendar"></i>
          <span>Calendar</span>
        </button> */}
        {/* 
        <button
          type="button"
          className="p-link layout-topbar-button"
         
        >
          <i className="pi pi-user"></i>
          <span>Profile</span>
        </button> */}

        <Link href="/documentation">
          <button type="button" className="p-link layout-topbar-button">
            <i className="pi pi-cog"></i>
            <span>Settings</span>
          </button>
        </Link>
        {me.store?.name && (
          <div className="p-link w-3 h-3 flex align-items-center ml-3">
            <Avatar
              label={me.store.name.charAt(0).toUpperCase()}
              onClick={(e) => profileMenu.current.toggle(e)}
            />
          </div>
        )}
        <Menu
          model={[
            {
              label: me.store?.name,
              icon: () => (
                <Avatar
                  label={me.store?.name.charAt(0).toUpperCase()}
                  onClick={(e) => profileMenu.current.toggle(e)}
                  className="mr-2"
                />
              ),
            },
            {
              label: "Switch Store",
              command: () => router.push("/store"),
            },
            {
              label: "Logout",
              command: handleLogout,
            },
          ]}
          popup
          ref={profileMenu}
          id="popup_menu_right"
          popupAlignment="right"
        />
        <button type="button" className="p-link layout-topbar-button md:hidden">
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
