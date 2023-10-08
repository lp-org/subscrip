import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import { useState } from "react";
import { Skeleton } from "primereact/skeleton";
import { useQueryClient } from "@tanstack/react-query";
const CheckoutForm = ({
  subscriptionId,
}: {
  subscriptionId: string;
  // isSetup: boolean;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const params = useParams();
  const query = useSearchParams();
  const storeId = params.storeId as string;
  const [errorMessage, setErrorMessage] = useState<string>();
  const queryClient = useQueryClient();
  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    let action;
    if (query.get("status") === "trialing") {
      action = stripe.confirmSetup;
    } else {
      action = stripe.confirmPayment;
    }
    queryClient.clear();
    const result = await action({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${location.protocol}//${location.host}/store/${storeId}/settings/billings/complete?s_subscription_id=${subscriptionId}`,
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)

      setErrorMessage(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      console.log("Payment done");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <span className="text-red-500"> {errorMessage}</span>
      <Button disabled={!stripe} className="w-full justify-content-center mt-4">
        Pay
      </Button>
    </form>
  );
};

export default CheckoutForm;
