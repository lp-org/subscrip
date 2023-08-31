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
import adminClient from "../../utils/adminClient";
import useAdminUser from "../../utils/use-admin-user";
import { Avatar } from "primereact/avatar";
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
  const { mutate } = useMutation({
    mutationFn: adminClient.auth.logout,
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
      showToast({
        severity: "info",
        detail: "Logout",
      });
      router.refresh();
    },
  });
  const handleLogout = () => mutate();

  return (
    <div className="layout-topbar">
      <Link href="/" className="layout-topbar-logo">
        <img
          src={`/layout/images/logo-${
            layoutConfig.colorScheme !== "light" ? "white" : "dark"
          }.svg`}
          width="47.22px"
          height={"35px"}
          alt="logo"
        />
        <span>SAKAI</span>
      </Link>

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
