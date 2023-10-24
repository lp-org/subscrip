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
  status: z.enum(["published", "draft"]).optional(),
});

export type createRoomType = z.infer<typeof createRoomDTO>;

export const updateRoomDTO = z.object({
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  basePrice: z.number().optional(),
  maximumOccupancy: z.number().optional().nullable(),
  quantity: z.number().optional().nullable(),
  status: z.enum(["published", "draft"]).optional(),
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

export const stripeConnectAccountDTO = z.object({
  refresh_url: z.string(),
  return_url: z.string(),
});

export type stripeConnectAccountType = z.infer<typeof stripeConnectAccountDTO>;

export const createCollectionDTO = z.object({
  name: z.string().min(1, "Collection name is required"),
  room_id: z.array(z.string()),
  status: z.enum(["published", "draft"]),
});

export type createCollectionType = z.infer<typeof createCollectionDTO>;

export const updateCollectionDTO = z.object({
  name: z.string().optional(),
  room_id: z.array(z.string()).optional(),
  status: z.enum(["published", "draft"]).optional(),
});

export type updateCollectionType = z.infer<typeof updateCollectionDTO>;

export const deleteCollectionRoomDTO = z.object({
  room_id: z.array(z.string()),
});

export type deleteCollectionRoomType = z.infer<typeof deleteCollectionRoomDTO>;

export const createPricingRuleDTO = z.object({
  type: z.enum(["percentage", "fixed", "amount"]),
  value: z.number(),
  startAt: z.date(),
  endAt: z.date().nullable().optional(),
  dayOfWeek: z.array(
    z.enum([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ])
  ),
});

export type createPricingRuleType = z.infer<typeof createPricingRuleDTO>;
