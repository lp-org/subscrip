"use client";
import { Card } from "primereact/card";
import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRequest } from "../../../../../../utils/adminClient";
import { formatPrice } from "ui";
import { Button } from "primereact/button";
import CheckoutForm from "../../../../../../components/CheckoutForm/Stripe";
import { Toolbar } from "primereact/toolbar";
import dayjs from "dayjs";
import { Badge } from "primereact/badge";
import { capitalize } from "lodash";
import relativeTime from "dayjs/plugin/relativeTime";
import { Divider } from "primereact/divider";
import { Skeleton } from "primereact/skeleton";
import { Panel } from "primereact/panel";
import { useIsActiveStore } from "../../../../../../utils/use-is-active-store";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentForm from "../../../../../../components/CheckoutForm/PaymentForm";

dayjs.extend(relativeTime);
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

interface PlanPrice {
  price: number;

  currency: string;
}

const SettingsBillings = () => {
  const { adminClient } = useRequest();
  const isActiveStore = useIsActiveStore();

  const { data: mySubscriptionData } = useQuery({
    queryFn: () =>
      adminClient.billing.mySubscription({
        status: "active,trialing,past_due",
      }),
    queryKey: ["mySubscriptionPlan"],
  });

  const myActiveSubscription = mySubscriptionData?.data;

  const { data: paymentMethodData } = useQuery({
    queryFn: () =>
      adminClient.billing.getPaymentMethod(
        myActiveSubscription?.[0].sPaymentMethodId
      ),
    queryKey: ["billing.getPaymentMethod"],
    enabled: myActiveSubscription?.[0]?.sPaymentMethodId ? true : false,
  });
  const paymentMethod = paymentMethodData?.data;

  const [planPrice, setPlanPrice] = useState<PlanPrice>();
  const router = useRouter();
  return (
    <Card title="Billings">
      {myActiveSubscription?.map((el) => (
        <Panel
          className="mb-4 w-full"
          pt={{
            title: {
              className: "w-full",
            },
          }}
          header={
            <div className="flex flex-row">
              <div className="flex flex-column">
                <div className="flex flex-row">
                  <div>{el?.plan?.name}</div>
                  <Badge
                    value={
                      el.status === "trialing"
                        ? "Trial"
                        : capitalize(el.status).replace("_", " ")
                    }
                    severity={
                      el.status === "past_due"
                        ? "danger"
                        : el.status === "trialing"
                        ? "info"
                        : "success"
                    }
                    className="ml-2"
                  ></Badge>
                </div>
                {planPrice && (
                  <div className="text-gray-500">
                    {formatPrice(planPrice.price, planPrice.currency)} / month
                  </div>
                )}
              </div>

              <div className="ml-auto">
                {el.status === "past_due" || !el.sPaymentMethodId ? (
                  <Button
                    className="w-full"
                    onClick={() => {
                      router.replace(`?sspid=${el.id}&status=${el.status}`);
                      setPlanPrice({
                        price: el.price,
                        currency: el.currency,
                      });
                    }}
                  >
                    Update Payment Method
                  </Button>
                ) : (
                  <Button icon="pi pi-ellipsis-v" link></Button>
                )}
              </div>
            </div>
          }
          key={el.id}
        >
          <p className="text-xl">
            Next Billing Date:{" "}
            <span className="font-bold">
              {dayjs(el.nextBillingDate).format("DD MMM YYYY")}
            </span>
          </p>
          {el.status === "trialing" && (
            <p className="text-gray-500 font-bold">
              {el.sPaymentMethodId
                ? `Your trial period will be ended on ${dayjs(
                    el.nextBillingDate
                  ).format(
                    "DD MMM YYYY"
                  )}, and will be automatically billed on that day.`
                : `Your trial plan will be ended on ${dayjs(
                    el.nextBillingDate
                  ).format("DD MMM YYYY")}`}
            </p>
          )}
          {paymentMethod?.card && (
            <p className="text-xl">
              Bill with:{" "}
              <span className="font-bold">{paymentMethod?.card.last4}</span>
            </p>
          )}

          <>
            <Divider type="solid" /> <PaymentForm />
          </>
        </Panel>
      ))}
    </Card>
  );
};

const SelectPlan = () => {
  const { adminClient } = useRequest();
  const { data } = useQuery({
    queryFn: adminClient.plan.list,
    queryKey: ["planList"],
  });

  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[0]>();

  const plans = data?.data;

  return (
    <>
      {" "}
      {!selectedPlan ? (
        <div>
          {plans?.map((el) => (
            <Card
              key={el.id}
              title={el.name}
              footer={
                <div className="flex justify-content-end gap-4 align-items-center">
                  <div className="font-bold text-xl">
                    {formatPrice(el.price, el.currency) + " /" + el.interval}
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedPlan(el);
                    }}
                  >
                    Select Plan
                  </Button>
                </div>
              }
            >
              <p className="font-bold"></p>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {" "}
          <Toolbar
            className="mb-4"
            start={selectedPlan.name}
            end={
              formatPrice(selectedPlan.price, selectedPlan.currency) +
              " /" +
              selectedPlan.interval
            }
          />
          <PaymentForm />
        </>
      )}
    </>
  );
};

export default SettingsBillings;
