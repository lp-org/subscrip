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
  gallery,
  collection,
  pricingRule,
} from "../schema";

export type StripeSubscriptionStatusType =
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused";

export type BookingPaymentStatusType =
  | "paid"
  | "not_paid"
  | "refunded"
  | "canceled";
type CreateType<T> = Omit<T, "id" | "createdAt" | "updatedAt">;
export type User = typeof user.$inferSelect;
export type NewUser = Omit<typeof user.$inferInsert, "id">;

export const roomSchema = createInsertSchema(room, {
  name: string().nonempty(),
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

export type StagedJob = typeof stagedJob;
export type Store = typeof store.$inferSelect;

export type Customer = typeof customer.$inferSelect;

export type Gallery = typeof gallery.$inferSelect;

export type Room = typeof room.$inferSelect & {
  images: Gallery[];
};

export type Collection = typeof collection.$inferSelect;

export type PricingRule = typeof pricingRule.$inferSelect;

export type Pricing = typeof room.$inferSelect & {
  pricingRule: PricingRule[];
  rooms: Room[];
};
