import { z } from "zod";

export const createBookingDTO = z.object({
  checkInDate: z.string().min(1, "Please choose check-in date"),
  checkOutDate: z.string().min(1, "Please choose check-out date"),
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

export const bookingCalendarDTO = z.object({
  startDate: z.string(),
  endDate: z.string(),
});

export type bookingCalendarType = z.infer<typeof bookingCalendarDTO>;
