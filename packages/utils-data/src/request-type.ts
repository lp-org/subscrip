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
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  basePrice: z.number().optional(),
  maximumOccupancy: z.number().optional(),
  published: z.boolean().optional(),
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

export const createCustomerDTO = z.object({
  email: z.string(),
  phone: z.string().optional(),
  storeId: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});
export type createCustomerType = z.infer<typeof createCustomerDTO>;

export const updateStoreSettingDTO = z.object({
  name: z.string().optional(),
  currency: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  favicon: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  ogimage: z.string().optional().nullable(),
});

export type updateStoreSettingDTOType = z.infer<typeof updateStoreSettingDTO>;

export const updateStoreSiteDTO = z.object({
  url: z.string().optional().nullable(),
  isCustomDomain: z.boolean().optional().nullable(),
  domain: z.string().optional().nullable(),
});

export type updateStoreSiteType = z.infer<typeof updateStoreSiteDTO>;
