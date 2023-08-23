import { AwilixContainer } from "awilix";
import { User } from "db";

declare global {
  namespace Express {
    interface Request {
      container: AwilixContainer;
      scope: AwilixContainer;
    }

    interface User {
      userId?: string;
    }
  }
}
