"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { useRequest } from "../../utils/adminClient";
import { Card } from "primereact/card";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { classNames } from "primereact/utils";
import clsx from "clsx";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import {
  CircleDollarSignIcon,
  Currency,
  DollarSign,
  Store,
} from "lucide-react";
import { Chip } from "primereact/chip";
import { Badge } from "primereact/badge";
import { Messages } from "primereact/messages";
import { useMountEffect } from "primereact/hooks";
import { Message } from "primereact/message";
import { Menu } from "primereact/menu";

const StorePaymentMethod = () => {
  const { adminClient } = useRequest();
  const { data } = useQuery({
    queryFn: adminClient.paymentMethod.list,
    queryKey: ["paymentMethodList"],
  });

  const paymentMethod = data?.data;

  const searchParams = useSearchParams();
  const paymentMethodId = searchParams.get("pid");
  const router = useRouter();
  useEffect(() => {
    router.replace(`?pid=${paymentMethod?.[0]?.id}`);
  }, [paymentMethod]);
  return (
    <Card title="Store Payment Method">
      <div className="flex gap-4">
        <SelectButton
          unselectable={false}
          value={paymentMethodId}
          optionLabel="name"
          optionValue="id"
          onChange={(e) => {
            router.replace(`?pid=${e.value}`);
          }}
          options={paymentMethod || []}
        />
        {/* {paymentMethod?.map((el) => (
          <div
            className={clsx([
              "border-solid border-round px-4 py-2 border-gray-500 hover:bg-gray-100 cursor-pointer",
              "bg-gray-700",
            ])}
            key={el.id}
            onClick={() => router.replace(`?pid=${el.id}`)}
          >
            {el.name}
          </div>
        ))} */}
      </div>

      <div className="mt-4 text-center text-xl font-bold">
        {paymentMethodId === "stripe-connect" ? (
          <>
            <StripeAccountComponent />
          </>
        ) : (
          <>Select a Payment Method</>
        )}
      </div>
    </Card>
  );
};

const StripeAccountComponent = () => {
  const { adminClient } = useRequest();
  const { data } = useQuery({
    queryFn: () =>
      adminClient.paymentMethod.getStorePaymentMethod("stripe-connect"),
  });
  const stripePaymentMethod = data?.data;
  const businessName =
    stripePaymentMethod?.accountDetails?.business_profile?.name;
  const payoutEnabled = stripePaymentMethod?.accountDetails?.payouts_enabled;
  const { mutate } = useMutation({
    mutationFn: adminClient.paymentMethod.stripeConnectAccount,
    onSuccess: (res) => {
      location.href = res.data.url;
    },
  });
  const params = useParams();
  const menu = useRef(null);
  const items = [
    {
      label: "Go to Stripe",
      icon: "pi pi-cog",
      command: () => {
        window.open(
          `https://dashboard.stripe.com/${stripePaymentMethod?.accountDetails?.id}`,
          "_blank"
        );
      },
    },
  ];
  return (
    <>
      {businessName ? (
        <Panel
          pt={{
            title: {
              className: "w-full",
            },
          }}
          header={
            <div className="flex flex-row gap-4 align-items-center">
              <Store />
              {businessName}
              <Badge value={stripePaymentMethod.status}></Badge>
              <Menu model={items} popup ref={menu} id="popup_menu_left" />
              <Button
                icon="pi pi-ellipsis-v"
                className="ml-auto"
                onClick={(event) => menu.current.toggle(event)}
                aria-haspopup
                link
              />
            </div>
          }
        >
          <div className="flex flex-row align-items-center">
            <div className="flex flex-row align-items-center gap-4">
              <CircleDollarSignIcon />
              Payout Currency
            </div>
            <div className="ml-4 uppercase font-bold">
              {stripePaymentMethod.accountDetails?.default_currency}
            </div>
          </div>

          {!payoutEnabled && (
            <Message
              className="mt-4"
              severity="warn"
              text="Payout is disabled. The account owner needs to provide more information to Stripe to enable payouts on this account."
            />
          )}
        </Panel>
      ) : (
        <>
          <div>Stripe Connect Account Not Found</div>
          <Button
            className="mt-4"
            severity="info"
            onClick={() => {
              mutate({
                refresh_url: `${location.origin}/store/${params.storeId}/payment-method?pid=stripe-connect`,
                return_url: `${location.origin}/store/${params.storeId}/payment-method?pid=stripe-connect`,
              });
            }}
          >
            Setup
          </Button>
        </>
      )}
    </>
  );
};

export default StorePaymentMethod;
