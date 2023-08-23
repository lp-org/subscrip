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
import AdminApi from "sdk/src/api/admin-api";
import { useToast } from "ui";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: AdminApi.auth.logout,
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
        <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-calendar"></i>
          <span>Calendar</span>
        </button>
        <button
          type="button"
          className="p-link layout-topbar-button"
          onClick={(e) => profileMenu.current.toggle(e)}
        >
          <i className="pi pi-user"></i>
          <span>Profile</span>
        </button>
        <Menu
          model={[
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
        <Link href="/documentation">
          <button type="button" className="p-link layout-topbar-button">
            <i className="pi pi-cog"></i>
            <span>Settings</span>
          </button>
        </Link>

        <button type="button" className="p-link layout-topbar-button md:hidden">
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
