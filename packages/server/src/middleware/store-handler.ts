import { AwilixContainer, asFunction, asValue } from "awilix";
import { NextFunction, Request, RequestHandler, Response } from "express";
import passport from "passport";

import { getCurrentStore, store } from "db";

// eslint-disable-next-line import/no-anonymous-default-export
export default (container: AwilixContainer): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const currentStore = await getCurrentStore(
      container,
      req.headers.storeid as string,
      req.user?.userId as string,
      req.headers.site as string
    );

    container.register({
      currentStore: asValue(currentStore),
    });
    next();
  };
};
