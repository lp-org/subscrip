import { z } from "zod";
import StoreService from "../services/StoreService";
import { createBookingDTO } from "utils-data";

export declare type Subscriber<T = unknown> = (
  data: T,
  eventName: string
) => Promise<void>;
export declare type SubscriberContext = {
  subscriberId: string;
};
export declare type SubscriberDescriptor = {
  id: string;
  subscriber: Subscriber;
};
export declare type EventHandler<T = unknown> = (
  data: T,
  eventName: string
) => Promise<void>;
export declare type EmitData<T = unknown> = {
  eventName: string;
  data: T;
  options?: Record<string, unknown>;
};

export type FilterType = {
  expands?: string[];
  where?: string[];
  orderBy?: {
    column: string;
    type: "ASC" | "DESC";
  };
  limit?: number;
  offset?: number;
};

export type CurrentStore = Awaited<ReturnType<StoreService["get"]>>;

export type createBookingDTOType = z.infer<typeof createBookingDTO>;
