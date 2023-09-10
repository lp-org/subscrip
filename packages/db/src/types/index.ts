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
  storeSubscriptionPlan,
} from "../schema";
import { InferModel } from "drizzle-orm";
export type StripeSubscriptionStatusType =
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused";

export type User = typeof user.$inferSelect;
export type NewUser = Omit<typeof user.$inferInsert, "id">;

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

export type Store = InferModel<typeof store, "select">;
export type NewStore = Omit<InferModel<typeof store, "insert">, "id">;

export type NewRoom = typeof room.$inferInsert;

export type NewStoreSubscriptionPlan =
  typeof storeSubscriptionPlan.$inferInsert;
