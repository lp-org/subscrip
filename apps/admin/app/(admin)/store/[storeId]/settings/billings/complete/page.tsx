"use client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Card } from "primereact/card";
import React, { useEffect, useState } from "react";
import { useRequest } from "../../../../../../../utils/adminClient";
import { Button } from "primereact/button";

const CompleteSubscriptionPage = () => {
  const query = useSearchParams();
  const { adminClient } = useRequest();

  const sSubscriptionId = query.get("s_subscription_id");
  const { data, refetch } = useQuery({
    queryFn: () =>
      adminClient.billing.mySubscription({
        sSubscriptionId: sSubscriptionId,
      }),
    queryKey: ["billingMySubscription"],
  });
  const subscription = data?.data?.[0];
  useEffect(() => {
    const pollingInterval = setInterval(() => {
      // Only refetch data if the previous response was an empty array
      if (subscription.storeInvoice.length === 0) {
        refetch();
      }
    }, 2000);

    // Clear the interval when the component unmounts
    return () => clearInterval(pollingInterval);
  }, [refetch, subscription]);
  if (!sSubscriptionId || !subscription) {
    return <></>;
  }

  return (
    <Card
      title={
        <>
          Payment Success! Enjoy Full Access with Your{" "}
          <span className="font-bold text-primary">
            {subscription.plan.name}{" "}
          </span>
          Subscription.{" "}
        </>
      }
    >
      <div className="flex justify-content-center">
        <Button>Go to Dashboard</Button>
      </div>
    </Card>
  );
};

export default CompleteSubscriptionPage;
