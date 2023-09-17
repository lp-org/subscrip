import { z } from "zod";

export const createBookingDTO = z.object({
  checkInDate: z.string(),
  checkOutDate: z.string(),
  roomId: z.string().min(1, "Please select a room"),
  totalAmount: z.number().nullable(),
  paymentStatus: z.string(),
  customerId: z.string().min(1, "Please select a customer"),
});

export const newCustomerDTO = z.object({
  email: z.string().min(1, "Email is required"),
  phone: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export type newCustomerDTOType = z.infer<typeof newCustomerDTO>;

export const disabledBookingDate = z.object({
  roomId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export type disabledBookingDateType = z.infer<typeof disabledBookingDate>;
