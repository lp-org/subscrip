import { createInsertSchema } from "drizzle-zod";
import { string, z } from "zod";
import {
  room,
  amenitiesType,
  user,
  pricing,
  customer,
  payment,
  booking,
  currency,
  setting,
  contactUs,
  stagedJob,
  store,
} from "../schema";
import { InferModel } from "drizzle-orm";

export type User = InferModel<typeof user, "select">;
export type NewUser = Omit<InferModel<typeof user, "insert">, "id">;

export type Store = InferModel<typeof store, "select">;
export type NewStore = Omit<InferModel<typeof store, "insert">, "id">;
export const roomSchema = createInsertSchema(room, {
  name: string().nonempty(),
  images: string().array(),
  amenities: z.record(z.enum(amenitiesType), z.boolean()),
});
export const userSchema = createInsertSchema(user);
export const pricingSchema = createInsertSchema(pricing);
export const customerSchema = createInsertSchema(customer);
export const paymentSchema = createInsertSchema(payment);
export const bookingSchema = createInsertSchema(booking);
export const bookingFilterSchema = createInsertSchema(booking, {
  checkInDate: z.string(),
  checkOutDate: z.string(),
  bookingNo: z.string(),
  roomId: z.string(),
});

export const currencySchema = createInsertSchema(currency);

export const settingSchema = createInsertSchema(setting);
export const contactUsSchema = createInsertSchema(contactUs);
export const stagedJobSchema = createInsertSchema(stagedJob);
