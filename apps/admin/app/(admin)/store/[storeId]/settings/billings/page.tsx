"use client";
import { Card } from "primereact/card";
import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
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
dayjs.extend(relativeTime);
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
const SettingsBillings = () => {
  const { adminClient } = useRequest();

  const { data: mySubscriptionData } = useQuery({
    queryFn: () =>
      adminClient.billing.mySubscription({ status: "active,trialing" }),
    queryKey: ["mySubscriptionPlan"],
  });

  const myActiveSubscription = mySubscriptionData?.data;
  const { data: paymentMethodData } = useQuery({
    queryFn: () =>
      adminClient.billing.getPaymentMethod(
        myActiveSubscription?.[0].sPaymentMethodId
      ),
    queryKey: ["billing.getPaymentMethod"],
    enabled: myActiveSubscription?.[0].sPaymentMethodId ? true : false,
  });
  const paymentMethod = paymentMethodData?.data;
  const [planId, setPlanId] = useState<string>();
  return (
    <Card title="Billings">
      {myActiveSubscription?.length ? (
        myActiveSubscription.map((el) => (
          <Card
            className="mb-4"
            title={
              <div className="flex flex-row">
                <div>{el?.plan?.name}</div>
                <div className="ml-auto">
                  {!el.sPaymentMethodId ? (
                    <Button
                      className="w-full"
                      onClick={() => setPlanId(el.planId)}
                    >
                      Update Payment Method
                    </Button>
                  ) : (
                    <Button icon="pi pi-ellipsis-v" link></Button>
                  )}
                </div>
              </div>
            }
            subTitle={
              <Badge
                value={
                  el.status === "trialing" ? "Trial" : capitalize(el.status)
                }
                className="px-2"
              ></Badge>
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
                  ? `Your trial period will be ended in ${dayjs().from(
                      el.nextBillingDate,
                      true
                    )} and charge automatically on next billing date`
                  : `Your trial plan will be ended in ${dayjs().from(
                      el.nextBillingDate,
                      true
                    )}`}
              </p>
            )}
            {paymentMethod?.card && (
              <p className="text-xl">
                Bill with:{" "}
                <span className="font-bold">{paymentMethod?.card.last4}</span>
              </p>
            )}

            {planId && (
              <>
                <Divider type="solid" />{" "}
                <PaymentForm planId={planId} isSetup={true} />
              </>
            )}
          </Card>
        ))
      ) : (
        <SelectPlan />
      )}
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
          />{" "}
          <PaymentForm planId={selectedPlan.id} />
        </>
      )}
    </>
  );
};

const PaymentForm = ({
  planId,
  isSetup,
}: {
  planId: string;
  isSetup?: boolean;
}) => {
  const { adminClient } = useRequest();
  const { mutate, isLoading } = useMutation({
    mutationFn: adminClient.billing.subscribe,
    onSuccess: (res) => {
      setClientSecret(res.data.clientSecret);
      setSubscriptionId(res.data.subscriptionId);
    },
  });
  const [clientSecret, setClientSecret] = useState<string>();
  const [subscriptionId, setSubscriptionId] = useState<string>();
  useEffect(() => {
    if (planId) mutate(planId);
  }, [mutate, planId]);
  if (isLoading)
    return (
      <>
        <Skeleton className="mb-2"></Skeleton>
        <Skeleton width="10rem" className="mb-2"></Skeleton>
        <Skeleton width="5rem" className="mb-2"></Skeleton>
        <Skeleton height="2rem" className="mb-2"></Skeleton>
        <Skeleton width="10rem" height="4rem"></Skeleton>
      </>
    );
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm subscriptionId={subscriptionId} isSetup={isSetup} />
    </Elements>
  );
};

export default SettingsBillings;
