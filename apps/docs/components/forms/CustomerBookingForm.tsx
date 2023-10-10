"use client";
import React, { useState, useTransition } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Form from "@radix-ui/react-form";
// import { CheckoutForm } from "../stripe/CheckoutForm";
// import { StripePayments } from "../stripe/StripePayments";
// import { bookRoom, checkout } from "@/server/booking";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Button } from "@radix-ui/themes";

const customerBookingSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().email().nonempty(),
  phone: z.string().nonempty(),
});

type CustomerBookingType = z.infer<typeof customerBookingSchema>;
const CustomerInfoForm = ({
  roomId,
  checkInDate,
  checkOutDate,
}: {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
}) => {
  const router = useRouter();
  const form = useForm<CustomerBookingType>({
    resolver: zodResolver(customerBookingSchema),
    defaultValues: {},
  });
  const [isPending, startTransition] = useTransition();
  const onSubmit = async (values: CustomerBookingType) => {
    startTransition(async () => {
      const booking = await bookRoom({
        checkInDate,
        checkOutDate,
        roomId,
        ...values,
      });

      router.push(`/bookRoom/checkout/${booking.bookingId}`);
    });
  };
  return (
    <Form.Root onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <Form.Field
          rules={{ required: true }}
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <>
              <Form.Label>First Name</Form.Label>
              <Form.Control>
                <InputText placeholder="First Name" {...field} />
              </Form.Control>

              <Form.Message />
            </>
          )}
        />
        <Form.Field
          rules={{ required: true }}
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <>
              <Form.Label>Last Name</Form.Label>
              <Form.Control>
                <InputText placeholder="Last Name" {...field} />
              </Form.Control>

              <Form.Message />
            </>
          )}
        />
      </div>

      <Form.Field
        rules={{ required: true }}
        control={form.control}
        name="email"
        render={({ field }) => (
          <>
            <Form.Label>Email</Form.Label>
            <Form.Control>
              <InputText placeholder="Email" {...field} />
            </Form.Control>

            <Form.Message />
          </>
        )}
      />

      <Form.Field
        rules={{ required: true }}
        control={form.control}
        name="phone"
        render={({ field }) => (
          <>
            <Form.Label>Phone No.</Form.Label>
            <Form.Control>
              <InputText type="tel" placeholder="Phone No." {...field} />
            </Form.Control>

            <Form.Message />
          </>
        )}
      />
      <Button type="submit" disabled={isPending} className="w-full">
        Continue
      </Button>
    </Form.Root>
  );
};

export default CustomerInfoForm;
