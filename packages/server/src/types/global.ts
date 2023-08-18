import { AwilixContainer } from "awilix";

declare global {
  namespace Express {
    interface Request {
      container: AwilixContainer;
      user: string;
      scope: AwilixContainer;
    }
  }
}
