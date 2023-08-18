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
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { array, custom, number, object, string, z } from "zod";

export const tenant = pgTable("tenant", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  url: text("url").unique(),
  active: boolean("active").default(true),
});

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  password: text("password"),
  phone: text("phone"),
  role: text("role").$type<"admin">(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const role = pgTable("role", {
  id: serial("id").primaryKey(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const permission = pgTable("permission", {
  key: text("key").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  rank: serial("rank"),
});

export const customer = pgTable(
  "customer",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email").notNull(),
    phone: text("phone"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      email: uniqueIndex("email_customer").on(table.email),
    };
  }
);

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
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  shortDescription: text("short_description"),
  images: json("images").default([]).$type<string[]>(),
  amenities: json("amenities")
    .default([])
    .$type<{ [x in AmenitiesType]: boolean }>(),

  order: serial("order"),
  basePrice: integer("base_price").default(0).notNull(),
  quantity: integer("quantity").default(0),
  maximumOccupancy: integer("maximum_occupancy").default(0),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const roomRelations = relations(room, ({ many }) => ({
  pricings: many(pricing),
  bookings: many(booking),
}));

export const pricing = pgTable("pricing", {
  id: serial("id").primaryKey(),
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
  roomId: integer("room_id").references(() => room.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const booking = pgTable("booking", {
  id: uuid("id").defaultRandom().primaryKey(),
  checkInDate: date("check_in_date").notNull(),
  checkOutDate: date("check_out_date").notNull(),
  roomId: integer("room_id").references(() => room.id),
  guestCount: integer("guest_count"),
  totalAmount: integer("total_amount").default(0),
  status: text("status").$type<"pending" | "success" | "cancel">(),
  bookingNo: serial("booking_no"),
  additionalData: jsonb("additional_data"),
  customerId: integer("customer_id").references(() => customer.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookingRelations = relations(booking, ({ many, one }) => ({
  room: one(room, { fields: [booking.roomId], references: [room.id] }),
  payments: many(payment),
  customer: one(customer, {
    fields: [booking.customerId],
    references: [customer.id],
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const paymentRelations = relations(payment, ({ one }) => ({
  booking: one(booking, {
    fields: [payment.bookingId],
    references: [booking.id],
  }),
}));

export const userSchema = createInsertSchema(user);

export const roomSchema = createInsertSchema(room, {
  name: string().nonempty(),
  images: string().array(),
  amenities: z.record(z.enum(amenitiesType), z.boolean()),
});
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

export const activityLog = pgTable("activity_log", {
  id: serial("id"),
  event: text("event"),
  payload: json("payload"),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gallery = pgTable("gallery", {
  id: serial("id"),
  fileKey: text("file_key"),
  fileType: text("file_type"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const setting = pgTable("setting", {
  id: serial("id"),
  name: text("name"),
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const currency = pgTable("currency", {
  code: text("code").primaryKey(),
  symbol: text("symbol"),
  symbolNative: text("symbol_native"),
  name: text("name"),
});

export const currencySchema = createInsertSchema(currency);

export const settingSchema = createInsertSchema(setting);

export const contactUs = pgTable("contact_us", {
  id: serial("id"),
  email: text("email"),
  name: text("name"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const batchJob = pgTable("batch_job", {
  id: serial("id"),
  type: text("type"),
  context: jsonb("context"),
  result: jsonb("result"),
  startAt: timestamp("start_at"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  failedAt: timestamp("failed_at"),
});

export const contactUsSchema = createInsertSchema(contactUs);

export const stagedJob = pgTable("staged_job", {
  id: serial("id"),
  eventName: text("event_name").notNull(),
  data: jsonb("data"),
  options: jsonb("options").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});
export const stagedJobSchema = createInsertSchema(stagedJob);
