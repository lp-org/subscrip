import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import EventBusService from "../services/EventBusService";
import { currency, plan } from "db";
import { CurrencyType, currencies } from "../utils";
import { Logger } from "winston";
import PaymentGatewayService from "../services/PaymentGatewayService";

type InjectedDependencies = {
  db: PostgresJsDatabase;
  logger: Logger;
  paymentGatewayService: PaymentGatewayService;
};
type Plan = typeof plan.$inferInsert;
export default class UserSeeder {
  protected readonly db_;
  protected readonly logger_;
  protected readonly paymentGatewayService_;
  constructor({ db, logger, paymentGatewayService }: InjectedDependencies) {
    this.db_ = db;
    this.logger_ = logger;
    this.paymentGatewayService_ = paymentGatewayService;
    this.seedUser();
    this.seedCurrency();
    this.seedPlan();
  }

  async seedUser() {
    console.log("Seeding User");
  }

  async seedCurrency() {
    const currencyList = await this.db_.select().from(currency);
    const currencyData: CurrencyType[] = [];
    for (const [key, value] of Object.entries(currencies)) {
      currencyData.push(value);
    }
    if (currencyList.length == 0) {
      await this.db_.insert(currency).values(currencyData);
      this.logger_.info("Seeded Currencies");
    }
  }

  async seedPlan() {
    const planList = await this.db_.select().from(plan);
    const plans: Plan[] = [
      {
        name: "Starter Plan",
        key: "starter",
        price: 200,
        currency: "USD",
        interval: "month",
        trialPeriod: 7,
      },
    ];
    if (planList.length == 0) {
      plans.forEach(async (el) => {
        const savedPlanId = await this.paymentGatewayService_.createPlan({
          amount: el.price!,
          currency: el.currency!,
          interval: el.interval!,
          name: el.name,
          trialPeriod: el.trialPeriod!,
        });
        await this.db_.insert(plan).values({
          name: el.name,
          key: el.key,
          currency: el.currency,
          price: el.price,
          sPlanId: savedPlanId,
          trialPeriod: el.trialPeriod,
        });
      });
      this.logger_.info("Seeded Plan");
    }
  }
}
