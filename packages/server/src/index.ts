import {
  asClass,
  asFunction,
  asValue,
  AwilixContainer,
  Lifetime,
} from "awilix";
import path from "path";
import glob from "glob";
import cors from "cors";
export * from "./services";

export * from "./plugin-service";
import Express from "express";
import { createLogger } from "winston";

import { loadControllers, scopePerRequest } from "awilix-express";
import { errorHandlerMiddleware } from "./middleware/error-handler";
export function registerService(container: AwilixContainer) {
  const corePath = "./services/*.js";
  const coreFull = path.join(__dirname, corePath);

  container.loadModules([[coreFull, "SCOPED"]], {
    formatName: "camelCase",
    // Apply resolver options to all modules.
    resolverOptions: {
      // We can give these auto-loaded modules
      // the deal of a lifetime! (see what I did there?)
      // By default it's `TRANSIENT`.
      lifetime: Lifetime.SCOPED,
      // We can tell Awilix what to register everything as,
      // instead of guessing. If omitted, will inspect the
      // module to determine what to register as.
      register: asClass,
    },
  });
}

export function registerRoutes(container: AwilixContainer) {
  const app = Express();

  const corePath = "./routes/*.js";
  // const coreFull = path.join(__dirname, corePath);
  app.use(
    cors({
      origin: "http://localhost:3002",
      credentials: true,
    })
  );

  app.use(scopePerRequest(container));

  // Loads all controllers in the `routes` folder
  // relative to the current working directory.
  // This is a glob pattern.
  app.use("/admin", loadControllers("./routes/admin/*.js", { cwd: __dirname }));

  app.use(errorHandlerMiddleware());
  app.listen(5000);
}

export function registerSubscriber(container: AwilixContainer) {
  const corePath = "./subscribers/*.js";
  const coreFull = path.join(__dirname, corePath);

  // container.loadModules([coreFull], {
  //   formatName: "camelCase",
  //   // Apply resolver options to all modules.
  //   resolverOptions: {
  //     lifetime: Lifetime.SINGLETON,

  //     injectionMode: "CLASSIC",
  //   },
  // });
  const core = glob.sync(coreFull, { cwd: __dirname });
  core.forEach((fn) => {
    const loaded = require(fn).default;

    container.build(asFunction((cradle) => new loaded(cradle)).singleton());
  });
}

export function registerLogger(container: AwilixContainer) {
  const logger = createLogger();

  container.register({
    logger: asValue(logger),
  });
}
