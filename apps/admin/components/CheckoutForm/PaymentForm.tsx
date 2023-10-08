"use client";
import { Elements } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRequest } from "../../utils/adminClient";
import CheckoutForm from "./Stripe";
import { Skeleton } from "primereact/skeleton";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const PaymentForm = ({ isSetup }: { isSetup?: boolean }) => {
  const { adminClient } = useRequest();
  const params = useSearchParams();
  const storeSubscriptionPlanId = params.get("sspid");
  const [clientSecret, setClientSecret] = useState<string>();
  const [subscriptionId, setSubscriptionId] = useState<string>();
  const { mutate, isLoading } = useMutation({
    mutationFn: adminClient.billing.getStoreSubscriptionPlan,
    onSuccess: (res) => {
      setClientSecret(res.data.clientSecret);
      setSubscriptionId(res.data.subscriptionId);
    },
  });
  useEffect(() => {
    if (storeSubscriptionPlanId) mutate(storeSubscriptionPlanId);
  }, [storeSubscriptionPlanId]);
  if (!storeSubscriptionPlanId) {
    return <></>;
  }
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
      <CheckoutForm subscriptionId={subscriptionId} />
    </Elements>
  );
};

export default PaymentForm;
