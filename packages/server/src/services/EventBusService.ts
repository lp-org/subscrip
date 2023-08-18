import { PgJsDatabaseType, stagedJob, stagedJobSchema } from "db";
import z from "zod";
import { isString } from "../utils/is-string";
import { sleep } from "../utils/sleep";
import { inArray } from "drizzle-orm";
import { EmitData, Subscriber, SubscriberContext } from "../types";
import { IEventBusModuleService } from "../interfaces/event-bus-module";
type StagedJob = z.infer<typeof stagedJobSchema>;

type InjectedDependencies = {
  db: PgJsDatabaseType;

  eventBusModuleService: IEventBusModuleService;
};

/**
 * Can keep track of multiple subscribers to different events and run the
 * subscribers when events happen. Events will run asynchronously.
 */
export default class EventBusService {
  protected readonly db_: PgJsDatabaseType;

  // eslint-disable-next-line max-len
  protected readonly eventBusModuleService_: IEventBusModuleService;

  protected shouldEnqueuerRun: boolean;
  protected enqueue_: Promise<void> | undefined;

  constructor(
    { db, eventBusModuleService }: InjectedDependencies,

    isSingleton = true
  ) {
    // eslint-disable-next-line prefer-rest-params
    // super(arguments[0]);

    this.db_ = db;
    this.eventBusModuleService_ = eventBusModuleService;

    this.shouldEnqueuerRun = false;

    if (process.env.NODE_ENV !== "test" && isSingleton) {
      this.startEnqueuer();
    }
  }

  //   withTransaction(transactionManager?: EntityManager): this {
  //     if (!transactionManager) {
  //       return this;
  //     }

  //     const cloned = new (this.constructor as any)(
  //       {
  //         manager: transactionManager,
  //         stagedJobService: this.stagedJobService_,
  //         eventBusModuleService: this.eventBusModuleService_,
  //       },
  //       this.config_,
  //       false
  //     );

  //     cloned.manager_ = transactionManager;
  //     cloned.transactionManager_ = transactionManager;

  //     return cloned;
  //   }

  /**
   * Adds a function to a list of event subscribers.
   * @param event - the event that the subscriber will listen for.
   * @param subscriber - the function to be called when a certain event
   * happens. Subscribers must return a Promise.
   * @param context - subscriber context
   * @return this
   */
  subscribe(
    event: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this {
    if (typeof subscriber !== "function") {
      throw new Error("Subscriber must be a function");
    }

    this.eventBusModuleService_.subscribe(event, subscriber, context);
    return this;
  }

  /**
   * Removes function from the list of event subscribers.
   * @param event - the event of the subcriber.
   * @param subscriber - the function to be removed
   * @param context - subscriber context
   * @return this
   */
  unsubscribe(
    event: string | symbol,
    subscriber: Subscriber,
    context: SubscriberContext
  ): this {
    this.eventBusModuleService_.unsubscribe(event, subscriber, context);
    return this;
  }

  /**
   * Calls all subscribers when an event occurs.
   * @param data - The data to use to process the events
   * @return the jobs from our queue
   */
  async emit<T>(data: EmitData<T>[]): Promise<StagedJob[] | void>;

  /**
   * Calls all subscribers when an event occurs.
   * @param {string} eventName - the name of the event to be process.
   * @param data - the data to send to the subscriber.
   * @param options - options to add the job with
   * @return the job from our queue
   */
  async emit<T>(
    eventName: string,
    data: T,
    options?: Record<string, unknown>
  ): Promise<StagedJob | void>;

  async emit<
    T,
    TInput extends string | EmitData<T>[] = string,
    TResult = TInput extends EmitData<T>[] ? StagedJob[] : StagedJob
  >(
    eventNameOrData: TInput,
    data?: T,
    options: Record<string, unknown> = {}
  ): Promise<TResult | void> {
    const isBulkEmit = !isString(eventNameOrData);
    const events = isBulkEmit
      ? eventNameOrData?.map((event) => ({
          eventName: event.eventName,
          data: event.data,
          options: event.options,
        }))
      : [
          {
            eventName: eventNameOrData,
            data: data,
            options: options,
          },
        ];

    /**
     * We store events in the database when in an ongoing transaction.
     *
     * If we are in a long-running transaction, the ACID properties of a
     * transaction ensure, that events are kept invisible to the enqueuer
     * until the transaction has committed.
     *
     * This patterns also gives us at-least-once delivery of events, as events
     * are only removed from the database, if they are successfully delivered.
     *
     * In case of a failing transaction, jobs stored in the database are removed
     * as part of the rollback.
     */

    const stagedJobs = await this.db_.insert(stagedJob).values(events);

    return (!isBulkEmit ? stagedJobs[0] : stagedJobs) as unknown as TResult;
  }

  startEnqueuer(): void {
    this.shouldEnqueuerRun = true;
    this.enqueue_ = this.enqueuer_();
  }

  async stopEnqueuer(): Promise<void> {
    this.shouldEnqueuerRun = false;
    await this.enqueue_;
  }

  async enqueuer_(): Promise<void> {
    const listConfig = {
      relations: [],
      skip: 0,
      take: 1000,
    };

    while (this.shouldEnqueuerRun) {
      const jobs = await this.db_.query.stagedJob.findMany();

      if (!jobs.length) {
        await sleep(5000);
        continue;
      }

      const eventsData = jobs.map((job) => {
        return {
          eventName: job.eventName,
          data: job.data,
          options: { jobId: job.id, ...job.options },
        };
      });

      await this.eventBusModuleService_.emit(eventsData).then(async () => {
        return await this.db_.delete(stagedJob).where(
          inArray(
            stagedJob.id,
            jobs.map((j) => j.id)
          )
        );
      });

      await sleep(5000);
    }
  }
}