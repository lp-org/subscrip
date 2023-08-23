/* eslint-disable @next/next/no-img-element */

import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import Link from "next/link";
import { AppMenuItem } from "./types/types";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);

  const model: AppMenuItem[] = [
    {
      label: "Home",
      items: [{ label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" }],
    },
    {
      label: "Setting",
      items: [
        {
          label: "Users & Permissions",
          icon: "pi pi-fw pi-id-card",
          to: "/settings/accounts",
        },
        {
          label: "Input",
          icon: "pi pi-fw pi-check-square",
          to: "/uikit/input",
        },
      ],
    },
    {
      label: "Prime Blocks",
      items: [
        {
          label: "Free Blocks",
          icon: "pi pi-fw pi-eye",
          to: "/blocks",
          badge: "NEW",
        },
        {
          label: "All Blocks",
          icon: "pi pi-fw pi-globe",
          url: "https://blocks.primereact.org",
          target: "_blank",
        },
      ],
    },

    {
      label: "Pages",
      icon: "pi pi-fw pi-briefcase",
      to: "/pages",
      items: [
        {
          label: "Landing",
          icon: "pi pi-fw pi-globe",
          to: "/landing",
        },
        {
          label: "Auth",
          icon: "pi pi-fw pi-user",
          items: [
            {
              label: "Login",
              icon: "pi pi-fw pi-sign-in",
              to: "/auth/login",
            },
            {
              label: "Error",
              icon: "pi pi-fw pi-times-circle",
              to: "/auth/error",
            },
            {
              label: "Access Denied",
              icon: "pi pi-fw pi-lock",
              to: "/auth/access",
            },
          ],
        },
        {
          label: "Crud",
          icon: "pi pi-fw pi-pencil",
          to: "/crud",
        },
        {
          label: "Timeline",
          icon: "pi pi-fw pi-calendar",
          to: "/pages/timeline",
        },
        {
          label: "Not Found",
          icon: "pi pi-fw pi-exclamation-circle",
          to: "/pages/notfound",
        },
        {
          label: "Empty",
          icon: "pi pi-fw pi-circle-off",
          to: "/pages/empty",
        },
      ],
    },
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item?.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator"></li>
          );
        })}

        <Link
          href="https://blocks.primereact.org"
          target="_blank"
          style={{ cursor: "pointer" }}
        >
          <img
            alt="Prime Blocks"
            className="w-full mt-3"
            src={`/layout/images/banner-primeblocks${
              layoutConfig.colorScheme === "light" ? "" : "-dark"
            }.png`}
          />
        </Link>
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
