/* eslint-disable @next/next/no-img-element */

import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import Link from "next/link";
import { AppMenuItem } from "./types/types";
import { useParams } from "next/navigation";
import { useAdminRouter } from "../../utils/use-admin-router";
const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);
  const { storeId } = useParams();
  const { push } = useAdminRouter();
  const model: AppMenuItem[] = [
    {
      label: "Home",
      items: [
        {
          label: "Dashboard",
          icon: "pi pi-fw pi-chart-bar",
          to: `/store/${storeId}/dashboard`,
        },
        {
          label: "Rooms",
          icon: "pi pi-fw pi-home",
          to: `/store/${storeId}/rooms`,
          command: () => push("/rooms"),
          preventExact: true,
          items: [
            {
              label: "Rooms",
              to: `/store/${storeId}/rooms`,
              preventExact: true,
            },
            {
              label: "Collection",
              to: `/store/${storeId}/collections`,
              preventExact: true,
            },
          ],
        },
        {
          label: "Bookings",
          icon: "pi pi-fw pi-book",
          to: `/store/${storeId}/bookings`,
        },
        {
          label: "Pricing",
          icon: "pi pi-fw pi-money",
          to: `/store/${storeId}/pricings`,
        },
      ],
    },

    {
      label: "Setting",
      items: [
        {
          label: "Store Settings",
          icon: "pi pi-fw pi-cog",
          to: `/store/${storeId}/settings`,
          items: [
            {
              label: "Store Settings",
              to: `/store/${storeId}/settings`,
              preventExact: true,
            },
            {
              label: "Store Payment Method",
              to: `/store/${storeId}/payment-method`,
              preventExact: true,
            },
          ],
        },
        {
          label: "Users & Permissions",
          icon: "pi pi-fw pi-user-edit",
          to: `/store/${storeId}/settings/accounts`,
        },
        {
          label: "Billings",
          icon: "pi pi-fw pi-credit-card",
          to: `/store/${storeId}/settings/billings`,
        },
      ],
    },
    // {
    //   label: "Prime Blocks",
    //   items: [
    //     {
    //       label: "Free Blocks",
    //       icon: "pi pi-fw pi-eye",
    //       to: "/blocks",
    //       badge: "NEW",
    //     },
    //     {
    //       label: "All Blocks",
    //       icon: "pi pi-fw pi-globe",
    //       url: "https://blocks.primereact.org",
    //       target: "_blank",
    //     },
    //   ],
    // },

    // {
    //   label: "Pages",
    //   icon: "pi pi-fw pi-briefcase",
    //   to: "/pages",
    //   items: [
    //     {
    //       label: "Landing",
    //       icon: "pi pi-fw pi-globe",
    //       to: "/landing",
    //     },
    //     {
    //       label: "Auth",
    //       icon: "pi pi-fw pi-user",
    //       to: `/store/${storeId}/settings/billings`,
    //       command: () => console.log("command"),
    //       items: [
    //         {
    //           label: "Login",
    //           icon: "pi pi-fw pi-sign-in",
    //           to: "/auth/login",
    //         },
    //         {
    //           label: "Error",
    //           icon: "pi pi-fw pi-times-circle",
    //           to: "/auth/error",
    //         },
    //         {
    //           label: "Access Denied",
    //           icon: "pi pi-fw pi-lock",
    //           to: "/auth/access",
    //         },
    //       ],
    //     },
    //     {
    //       label: "Crud",
    //       icon: "pi pi-fw pi-pencil",
    //       to: `/store/${storeId}/crud`,
    //     },
    //     {
    //       label: "Timeline",
    //       icon: "pi pi-fw pi-calendar",
    //       to: "/pages/timeline",
    //     },
    //     {
    //       label: "Not Found",
    //       icon: "pi pi-fw pi-exclamation-circle",
    //       to: "/pages/notfound",
    //     },
    //     {
    //       label: "Empty",
    //       icon: "pi pi-fw pi-circle-off",
    //       to: "/pages/empty",
    //     },
    //   ],
    // },
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
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
