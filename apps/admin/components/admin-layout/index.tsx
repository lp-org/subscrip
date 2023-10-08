/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import {
  useEventListener,
  useMountEffect,
  useUnmountEffect,
} from "primereact/hooks";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect, useRef } from "react";
import AppFooter from "./AppFooter";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";
import AppConfig from "./AppConfig";
import { LayoutContext } from "./context/layoutcontext";
import PrimeReact from "primereact/api";
import { ChildContainerProps, LayoutState, AppTopbarRef } from "./types/types";
import { usePathname, useSearchParams } from "next/navigation";
import { Messages } from "primereact/messages";
import useAdminUser from "../../utils/use-admin-user";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useAdminRouter } from "../../utils/use-admin-router";
dayjs.extend(relativeTime);

const Layout = ({ children }: ChildContainerProps) => {
  const { layoutConfig, layoutState, setLayoutState } =
    useContext(LayoutContext);
  const topbarRef = useRef<AppTopbarRef>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { data } = useAdminUser();
  const msgs = useRef(null);
  const { push } = useAdminRouter();
  useMountEffect(() => {
    const storeData = data?.data.store;
    if (dayjs(storeData?.nextBillingDate).isAfter(dayjs())) {
      if (storeData?.planStatus === "trialing") {
        msgs.current.show({
          sticky: true,
          severity: "info",

          summary: `Your period will end ${dayjs(
            storeData.nextBillingDate
          ).from(dayjs())}`,
          detail: "",
          content: (
            <div className="flex flex-column">
              <div className="font-bold">
                Your trial period will end{" "}
                {dayjs(storeData.nextBillingDate).from(dayjs())}
              </div>
              {!storeData.sPaymentMethodId && (
                <div
                  onClick={() => push("/settings/billings")}
                  className="cursor-pointer hover:underline"
                >
                  Please update your payment method to ensure uninterrupted
                  service
                </div>
              )}
            </div>
          ),
          closable: true,
        });
      }
    }
  });
  const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] =
    useEventListener({
      type: "click",
      listener: (event) => {
        const isOutsideClicked = !(
          sidebarRef.current?.isSameNode(event.target as Node) ||
          sidebarRef.current?.contains(event.target as Node) ||
          topbarRef.current?.menubutton?.isSameNode(event.target as Node) ||
          topbarRef.current?.menubutton?.contains(event.target as Node)
        );

        if (isOutsideClicked) {
          hideMenu();
        }
      },
    });

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    hideMenu();
    hideProfileMenu();
  }, [pathname, searchParams]);

  const [
    bindProfileMenuOutsideClickListener,
    unbindProfileMenuOutsideClickListener,
  ] = useEventListener({
    type: "click",
    listener: (event) => {
      const isOutsideClicked = !(
        topbarRef.current?.topbarmenu?.isSameNode(event.target as Node) ||
        topbarRef.current?.topbarmenu?.contains(event.target as Node) ||
        topbarRef.current?.topbarmenubutton?.isSameNode(event.target as Node) ||
        topbarRef.current?.topbarmenubutton?.contains(event.target as Node)
      );

      if (isOutsideClicked) {
        hideProfileMenu();
      }
    },
  });

  const hideMenu = () => {
    setLayoutState((prevLayoutState: LayoutState) => ({
      ...prevLayoutState,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
      menuHoverActive: false,
    }));
    unbindMenuOutsideClickListener();
    unblockBodyScroll();
  };

  const hideProfileMenu = () => {
    setLayoutState((prevLayoutState: LayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: false,
    }));
    unbindProfileMenuOutsideClickListener();
  };

  const blockBodyScroll = (): void => {
    if (document.body.classList) {
      document.body.classList.add("blocked-scroll");
    } else {
      document.body.className += " blocked-scroll";
    }
  };

  const unblockBodyScroll = (): void => {
    if (document.body.classList) {
      document.body.classList.remove("blocked-scroll");
    } else {
      document.body.className = document.body.className.replace(
        new RegExp(
          "(^|\\b)" + "blocked-scroll".split(" ").join("|") + "(\\b|$)",
          "gi"
        ),
        " "
      );
    }
  };

  useMountEffect(() => {
    PrimeReact.ripple = true;
  });

  useEffect(() => {
    if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
      bindMenuOutsideClickListener();
    }

    layoutState.staticMenuMobileActive && blockBodyScroll();
  }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

  useEffect(() => {
    if (layoutState.profileSidebarVisible) {
      bindProfileMenuOutsideClickListener();
    }
  }, [layoutState.profileSidebarVisible]);

  useUnmountEffect(() => {
    unbindMenuOutsideClickListener();
    unbindProfileMenuOutsideClickListener();
  });

  const containerClass = classNames("layout-wrapper", {
    "layout-overlay": layoutConfig.menuMode === "overlay",
    "layout-static": layoutConfig.menuMode === "static",
    "layout-static-inactive":
      layoutState.staticMenuDesktopInactive &&
      layoutConfig.menuMode === "static",
    "layout-overlay-active": layoutState.overlayMenuActive,
    "layout-mobile-active": layoutState.staticMenuMobileActive,
    "p-input-filled": layoutConfig.inputStyle === "filled",
    "p-ripple-disabled": !layoutConfig.ripple,
  });

  return (
    <React.Fragment>
      <div className={containerClass}>
        <AppTopbar ref={topbarRef} />
        <div ref={sidebarRef} className="layout-sidebar">
          <AppSidebar />
          <Messages ref={msgs} />
        </div>
        <div className="layout-main-container">
          <div className="layout-main">{children}</div>
          <AppFooter />
        </div>
        <AppConfig />
        <div className="layout-mask"></div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
