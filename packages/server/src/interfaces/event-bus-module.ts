import { EmitData, Subscriber, SubscriberContext } from "../types";

export interface IEventBusModuleService {
  emit<T>(
    eventName: string,
    data: T,
    options: Record<string, unknown>
  ): Promise<void>;
  emit<T>(data: EmitData<T>[]): Promise<void>;

  subscribe(
    eventName: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this;

  unsubscribe(
    eventName: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this;
}
