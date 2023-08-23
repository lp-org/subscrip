import {
  asClass,
  asFunction,
  asValue,
  createContainer,
  listModules,
} from "awilix";
import { connectDatabase } from "db";
import {
  registerLogger,
  registerRoutes,
  registerService,
  registerSubscriber,
} from "server";
import LocalEventBusService from "server/src/plugin-service/event-bus-local";
import LocalFileService from "server/src/plugin-service/local-file";

function initialize() {
  const defaultContainer = createContainer();

  defaultContainer.register({
    db: asFunction(() =>
      connectDatabase(process.env.DATABASE_URL as string)
    ).singleton(),
    eventBusModuleService: asClass(LocalEventBusService),
  });
  // register API

  registerService(defaultContainer);
  registerRoutes(defaultContainer);
  registerLogger(defaultContainer);

  registerSubscriber(defaultContainer);
  // customize service
  defaultContainer.register("fileService", asClass(LocalFileService));
  return defaultContainer;
}

export default initialize;
