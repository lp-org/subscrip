import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import EventBusService from "../services/EventBusService";

type InjectedDependencies = {
  db: PostgresJsDatabase;
};

export default class UserSeeder {
  protected readonly db_;
  constructor({ db }: InjectedDependencies) {
    this.db_ = db;

    this.seedUser();
  }

  async seedUser() {
    console.log("Seeding User");
  }
}
