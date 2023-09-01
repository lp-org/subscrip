import {
  asClass,
  asFunction,
  asValue,
  createContainer,
  listModules,
} from "awilix";
import { connectDatabase } from "db";
import {
  LocalEventBusService,
  LocalFileService,
  registerLogger,
  registerRoutes,
  registerSeeder,
  registerService,
  registerSubscriber,
} from "server";

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

  registerSeeder(defaultContainer);
  // customize service
  defaultContainer.register("fileService", asClass(LocalFileService));
  return defaultContainer;
}

export default initialize;
