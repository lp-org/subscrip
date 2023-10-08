"use client";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React from "react";
import { useRequest } from "../../../../../utils/adminClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatPrice } from "ui";
import { Divider } from "primereact/divider";
import { useAdminRouter } from "../../../../../utils/use-admin-router";
import PaymentForm from "../../../../../components/CheckoutForm/PaymentForm";

const features = [
  "Unlimited Room",
  "Front Desk",
  "Room Management",
  "Booking Management",
  "1 Frontstore Booking Website",
  "Payment Processing & Invoicing",
];

const advanceFeatures = ["More features"];
const SubscribePage = () => {
  const router = useRouter();
  const { adminClient } = useRequest();
  const { data } = useQuery({
    queryFn: adminClient.plan.list,
    queryKey: ["planList"],
  });
  const { push } = useAdminRouter();
  const planList = data?.data;
  const { mutate, isLoading } = useMutation({
    mutationFn: adminClient.billing.subscribe,
    onSuccess: (res) => {
      push(`subscribe/billing?sspid=${res.data.storeSubscriptionPlanId}`);
    },
  });
  const handleBuy = (id: string) => {
    mutate(id);
  };

  return (
    <div className="m-4">
      <div>
        <Button
          icon="pi pi-angle-left"
          type="button"
          link
          onClick={() => {
            router.back();
          }}
          className="text-gray-700"
          label="Back"
        />
      </div>
      <div>
        <h2 className="text-center">
          Your store subscription has been canceled{" "}
        </h2>
        <div className=" flex justify-content-center gap-4">
          {planList?.map((el) => (
            <Card
              className="md:w-25rem w-full border-solid"
              title={el.name}
              subTitle={"For small site"}
              key={el.id}
              footer={
                <Button
                  className="block w-full"
                  onClick={() => handleBuy(el.id)}
                >
                  Buy Now
                </Button>
              }
            >
              <hr />
              <div className="font-bold text-xl">
                {formatPrice(el.price, el.currency)} / month
              </div>
              <hr />

              <ul className="list-none p-0 m-0">
                {features.map((el, i) => (
                  <li className="flex align-items-center mb-3" key={i}>
                    <i
                      className="pi pi-check bg-primary border-round p-1"
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    ></i>

                    <span className="font-bold text-700 ml-2">{el}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
          <Card
            className="md:w-25rem w-full "
            title={"Advance/Custom"}
            subTitle={"For Larger Team"}
            pt={{
              body: {
                className: "h-full flex flex-column",
              },
              footer: {
                className: "mt-auto",
              },
            }}
            footer={
              <Button className="block w-full mt-auto" disabled>
                Coming Soon
              </Button>
            }
          >
            <hr />
            <div className="font-bold text-xl">$ TBD</div>
            <hr />

            <ul className="list-none p-0 m-0">
              {advanceFeatures.map((el, i) => (
                <li className="flex align-items-center mb-3" key={i}>
                  <i
                    className="pi pi-check bg-primary border-round p-1"
                    style={{ width: "1.5rem", height: "1.5rem" }}
                  ></i>

                  <span className="font-bold text-700 ml-2">{el}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <PaymentForm />
      </div>
    </div>
  );
};

export default SubscribePage;
