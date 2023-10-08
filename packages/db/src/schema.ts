import {
  serial,
  text,
  timestamp,
  pgTable,
  integer,
  date,
  uuid,
  boolean,
  json,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  BookingPaymentStatusType,
  StripeSubscriptionStatusType,
} from "./types";

export const store = pgTable("store", {
  id: uuid("id").defaultRandom().primaryKey(),
  // name: text("name").notNull().default("My Store"),
  email: text("email"),
  plan: text("plan"),
  planStatus: text("plan_status"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const storeSite = pgTable("storeSite", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").unique(),
  isCustomDomain: boolean("is_custom_domain").default(false),
  domain: text("domain"),
  storeId: uuid("store_id")
    .unique()
    .references(() => store.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const plan = pgTable("plan", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").$type<"starter">().default("starter"),
  name: text("name").notNull(),
  description: text("description"),
  interval: text("interval").$type<"day" | "month" | "year">().default("month"),
  currency: text("currency").references(() => currency.code),
  price: integer("price"),
  trialPeriod: integer("trial_period"),
  sPlanId: text("s_plan_id"),
});

export const storeSubscriptionPlan = pgTable("store_subscription_plan", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").references(() => store.id),
  planId: uuid("plan_id").references(() => plan.id),
  status: text("status")
    .$type<StripeSubscriptionStatusType>()
    .default("incomplete"),
  currency: text("currency").references(() => currency.code),
  price: integer("price"),
  nextBillingDate: timestamp("next_billing_date"),
  sSubscriptionId: text("s_subscription_id").unique(),
  sPaymentMethodId: text("s_payment_method_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  password: text("password").notNull(),
  phone: text("phone"),
  role_id: text("role").$type<"admin">(),
  active: boolean("active").default(true),
  sCustomerId: text("s_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const storeInvoice = pgTable("store_invoice", {
  id: uuid("id").defaultRandom().primaryKey(),
  sInvoiceId: text("s_invoice_id").unique(),
  sCustomerId: text("s_customer_id"),
  sSubscriptionId: text("s_subscription_id"),
  amount: integer("amount"),
  status: text("status"),
  currency: text("currency"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const storeRelations = relations(store, ({ many, one }) => ({
  room: many(room),
  user: many(user),
  storeSubscriptionPlan: one(storeSubscriptionPlan),
  booking: many(booking),
  customer: many(customer),
  setting: one(setting),
  gallery: many(gallery),
}));

export const planRelations = relations(plan, ({ many, one }) => ({
  storeSubscriptionPlans: many(storeSubscriptionPlan),
}));

export const storeSubscriptionPlanRelations = relations(
  storeSubscriptionPlan,
  ({ many, one }) => ({
    plan: one(plan, {
      fields: [storeSubscriptionPlan.planId],
      references: [plan.id],
    }),
    store: one(store),
    storeInvoice: many(storeInvoice),
  })
);

export const storeInvoiceRelations = relations(storeInvoice, ({ one }) => ({
  storeSubscriptionPlan: one(storeSubscriptionPlan, {
    fields: [storeInvoice.sSubscriptionId],
    references: [storeSubscriptionPlan.sSubscriptionId],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  store: many(store),
}));

export const storeToUser = pgTable("store_to_user", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .notNull()
    .references(() => store.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  isOwner: boolean("is_owner").default(true),
});

export const storeToUserRelations = relations(storeToUser, ({ one }) => ({
  store: one(store, {
    fields: [storeToUser.storeId],
    references: [store.id],
  }),
  user: one(user, {
    fields: [storeToUser.userId],
    references: [user.id],
  }),
}));

// export const permissionToStoreUser = pgTable(
//   "permission_to_store_user",
//   {
//     storeUserId: uuid("store_user_id").references(() => storeToUser.id),
//     permissionId: uuid("permission_id").references(() => permission.id),
//   },
//   (t) => ({
//     pk: primaryKey(t.storeUserId, t.permissionId),
//   })
// );

export const permission = pgTable("permission", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  rank: serial("rank"),
});

export const customer = pgTable("customer", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").notNull(),
  phone: text("phone"),
  password: text("password"),
  storeId: uuid("store_id").references(() => store.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const customerRelations = relations(customer, ({ one }) => ({
  store: one(store, {
    fields: [customer.storeId],
    references: [store.id],
  }),
}));

export const amenitiesType = [
  "wifi",
  "private_pool",
  "free_parking",
  "air_cond",
  "kitchen",
  "sea_view",
  "washer",
  "balcony",
] as const;
export type AmenitiesType = (typeof amenitiesType)[number];

export const room = pgTable("room", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  shortDescription: text("short_description"),

  amenities: json("amenities")
    .default([])
    .$type<{ [x in AmenitiesType]: boolean }>(),

  order: serial("order"),
  basePrice: integer("base_price").default(0).notNull(),
  quantity: integer("quantity").default(0),
  maximumOccupancy: integer("maximum_occupancy").default(0),
  published: boolean("published").default(false),
  storeId: uuid("store_id").references(() => store.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const roomImages = pgTable("room_images", {
  roomId: uuid("room_id").references(() => room.id, {
    onDelete: "cascade",
  }),
  galleryId: uuid("gallery_id").references(() => gallery.id, {
    onDelete: "cascade",
  }),
  position: integer("position").default(0),
});

export const roomImagesRelations = relations(roomImages, ({ one }) => ({
  room: one(room, { fields: [roomImages.roomId], references: [room.id] }),
  gallery: one(gallery, {
    fields: [roomImages.galleryId],
    references: [gallery.id],
  }),
}));

export const roomRelations = relations(room, ({ many, one }) => ({
  pricings: many(pricing),
  bookings: many(booking),
  store: one(store, { fields: [room.storeId], references: [store.id] }),
  images: many(roomImages),
}));

export const pricing = pgTable("pricing", {
  id: uuid("id").defaultRandom().primaryKey(),
  price: integer("price").default(0),
  dayOfWeek: text("day_of_week").$type<
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"
  >(),
  date: date("date"),
  roomId: uuid("room_id").references(() => room.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const pricingRelations = relations(pricing, ({ one }) => ({
  room: one(room, { fields: [pricing.roomId], references: [room.id] }),
}));

export const booking = pgTable("booking", {
  id: uuid("id").defaultRandom().primaryKey(),
  checkInDate: date("check_in_date").notNull(),
  checkOutDate: date("check_out_date").notNull(),
  roomId: uuid("room_id").references(() => room.id),
  guestCount: integer("guest_count"),
  totalAmount: integer("total_amount").default(0),
  status: text("status").$type<"pending" | "booked" | "cancel">(),
  paymentStatus: text("payment_status")
    .$type<BookingPaymentStatusType>()
    .default("not_paid"),
  bookingNo: serial("booking_no"),
  additionalData: jsonb("additional_data"),
  customerId: uuid("customer_id").references(() => customer.id),
  createdBy: uuid("created_by").references(() => user.id),
  storeId: uuid("store_id").references(() => store.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const bookingRelations = relations(booking, ({ many, one }) => ({
  room: one(room, { fields: [booking.roomId], references: [room.id] }),
  payments: many(payment),
  customer: one(customer, {
    fields: [booking.customerId],
    references: [customer.id],
  }),
  store: one(store, {
    fields: [booking.storeId],
    references: [store.id],
  }),
}));

export const payment = pgTable("payment", {
  id: uuid("id").defaultRandom().primaryKey(),
  amount: integer("amount").default(0),
  currency: text("currency"),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => booking.id),
  status: text("status").$type<"pending" | "success" | "failed">(),
  type: text("type").$type<"cash" | "online">(),
  reference: text("reference"),
  storeId: uuid("store_id").references(() => store.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

/**
 * 1. Online - stripe, stripe_connect
 * 2. Cash
 * 3.
 */
export const paymentProvider = pgTable("payment_provider", {
  key: text("key").unique(),
  name: text("name"),
});

export const paymentMethod = pgTable("payment_method", {
  id: uuid("id").defaultRandom().primaryKey(),
  paymentProvider: text("payment_provider").references(
    () => paymentProvider.key
  ),
  storeId: uuid("store_id").references(() => store.id),
  type: text("type").$type<"cash" | "online">(),
  connectedAccountId: text("connected_account_id"),
  clientKey: text("client_key"),
  secretKey: text("secret_key"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const paymentRelations = relations(payment, ({ one }) => ({
  booking: one(booking, {
    fields: [payment.bookingId],
    references: [booking.id],
  }),
}));

export const activityLog = pgTable("activity_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  event: text("event"),
  payload: json("payload"),
  userId: integer("user_id").notNull(),
  storeId: uuid("store_id").references(() => store.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const gallery = pgTable("gallery", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  fileKey: text("file_key").notNull(),
  fileType: text("file_type"),
  size: integer("size"),
  storeId: uuid("store_id").references(() => store.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const galleryRelations = relations(gallery, ({ one, many }) => ({
  store: one(store, {
    fields: [gallery.storeId],
    references: [store.id],
  }),
  roomImages: many(roomImages),
}));

export const setting = pgTable("setting", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").default("My Store"),
  email: text("email"),
  logo: text("logo"),
  favicon: text("favicon"),
  ogimage: text("ogimage"),
  phone: text("phone"),
  address: text("address"),
  facebook: text("facebook"),
  instagram: text("instagram"),
  currency: text("currency"),
  slider: jsonb("slider").default([]),
  storeId: uuid("store_id")
    .unique()
    .references(() => store.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const settingRelation = relations(setting, ({ one }) => ({
  store: one(store, {
    fields: [setting.storeId],
    references: [store.id],
  }),
}));

export const currency = pgTable("currency", {
  code: text("code").primaryKey(),
  symbol: text("symbol"),
  symbolNative: text("symbol_native"),
  name: text("name"),
});

export const contactUs = pgTable("contact_us", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email"),
  name: text("name"),
  message: text("message"),
  storeId: uuid("store_id").references(() => store.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const batchJob = pgTable("batch_job", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type"),
  context: jsonb("context"),
  result: jsonb("result"),
  startAt: timestamp("start_at"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  completedAt: timestamp("completed_at"),
  failedAt: timestamp("failed_at"),
});

export const notification = pgTable("notification", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventName: text("event_name"),
  resourceType: text("resource_type").notNull(),
  resourceId: uuid("resource_id").notNull(),
  to: text("to").notNull(),
  data: text("data"),
  resendFromId: uuid("resend_from_id"),
  storeId: uuid("store_id")
    .references(() => store.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const notificationRelations = relations(notification, ({ one }) => ({
  resendForm: one(notification, {
    fields: [notification.resendFromId],
    references: [notification.id],
  }),
}));

export const stagedJob = pgTable("staged_job", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventName: text("event_name").notNull(),
  data: jsonb("data"),
  options: jsonb("options").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
