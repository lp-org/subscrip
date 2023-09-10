import { PgJsDatabaseType, plan } from "db";
import { RESOLVER } from "awilix";
import { eq } from "drizzle-orm";
type InjectedDependencies = {
  db: PgJsDatabaseType;
};
export default class PlanService {
  static [RESOLVER] = {};
  protected readonly db_: PgJsDatabaseType;
  constructor({ db }: InjectedDependencies) {
    this.db_ = db;
  }

  async list() {
    return await this.db_.transaction(async (tx) => {
      const data = await tx.select().from(plan);

      return data;
    });
  }

  async get(planId: string) {
    return await this.db_.transaction(async (tx) => {
      const data = await tx.select().from(plan).where(eq(plan.id, planId));

      return data[0];
    });
  }
}
