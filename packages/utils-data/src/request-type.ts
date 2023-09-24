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

export const deleteFileDTO = z.object({
  fileKey: z.array(z.string()),
});

export type deleteFileType = z.infer<typeof deleteFileDTO>;

export const createRoomDTO = z.object({
  name: z.string(),
  images: z.array(z.string()),
  description: z.string(),
  shortDescription: z.string(),
  basePrice: z.number(),
  maximumOccupancy: z.number(),
  published: z.boolean(),
});

export type createRoomType = z.infer<typeof createRoomDTO>;

export const updateRoomDTO = z.object({
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  basePrice: z.number().optional(),
  maximumOccupancy: z.number().optional().nullable(),
  quantity: z.number().optional().nullable(),
  published: z.boolean().optional().nullable(),
});

export type updateRoomType = z.infer<typeof updateRoomDTO>;

export const upsertRoomImageDTO = z.object({
  g_ids: z.array(z.string()),
});

export type updateRoomImageType = z.infer<typeof upsertRoomImageDTO>;
