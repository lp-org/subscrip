import { EventEmitter } from "events";
import { EmitData, Subscriber, SubscriberContext } from "../types";
import { ulid } from "ulid";
import { Logger } from "winston";
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(Infinity);

type InjectedDependencies = {
  logger: Logger;
};

export declare type SubscriberDescriptor = {
  id: string;
  subscriber: Subscriber;
};

// eslint-disable-next-line max-len
export default class LocalEventBusService {
  protected readonly eventEmitter_: EventEmitter;
  protected readonly logger_: Logger;

  protected eventToSubscribersMap_: Map<
    string | symbol,
    SubscriberDescriptor[]
  > = new Map();
  constructor({ logger }: InjectedDependencies) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params

    this.logger_ = logger;
    this.eventEmitter_ = eventEmitter;
  }

  async emit<T>(
    eventName: string,
    data: T,
    options: Record<string, unknown>
  ): Promise<void>;

  /**
   * Emit a number of events
   * @param {EmitData} data - the data to send to the subscriber.
   */
  async emit<T>(data: EmitData<T>[]): Promise<void>;

  async emit<T, TInput extends string | EmitData<T>[] = string>(
    eventOrData: TInput,
    data?: T,
    options: Record<string, unknown> = {}
  ): Promise<void> {
    const isBulkEmit = Array.isArray(eventOrData);

    const events: EmitData[] = isBulkEmit
      ? eventOrData
      : [{ eventName: eventOrData, data }];

    for (const event of events) {
      const eventListenersCount = this.eventEmitter_.listenerCount(
        event.eventName
      );

      this.logger_.info(
        `Processing ${event.eventName} which has ${eventListenersCount} subscribers`
      );

      if (eventListenersCount === 0) {
        continue;
      }

      this.eventEmitter_.emit(event.eventName, event.data);
    }
  }

  subscribe(event: string | symbol, subscriber: Subscriber): this {
    const randId = ulid();
    this.storeSubscribers({ event, subscriberId: randId, subscriber });
    this.eventEmitter_.on(event, async (...args) => {
      try {
        // @ts-ignore
        await subscriber(...args);
      } catch (e) {
        this.logger_.error(
          `An error occurred while processing ${event.toString()}: ${e}`
        );
      }
    });
    return this;
  }

  unsubscribe(
    event: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this {
    const existingSubscribers = this.eventToSubscribersMap_.get(event);

    if (existingSubscribers?.length) {
      const subIndex = existingSubscribers?.findIndex(
        (sub) => sub.id === context?.subscriberId
      );

      if (subIndex !== -1) {
        this.eventToSubscribersMap_.get(event)?.splice(subIndex as number, 1);
      }
    }

    this.eventEmitter_.off(event, subscriber);
    return this;
  }

  protected storeSubscribers({
    event,
    subscriberId,
    subscriber,
  }: {
    event: string | symbol;
    subscriberId: string;
    subscriber: Subscriber;
  }) {
    const newSubscriberDescriptor = { subscriber, id: subscriberId };

    const existingSubscribers = this.eventToSubscribersMap_.get(event) ?? [];

    const subscriberAlreadyExists = existingSubscribers.find(
      (sub) => sub.id === subscriberId
    );

    if (subscriberAlreadyExists) {
      throw Error(`Subscriber with id ${subscriberId} already exists`);
    }

    this.eventToSubscribersMap_.set(event, [
      ...existingSubscribers,
      newSubscriberDescriptor,
    ]);
  }
}
