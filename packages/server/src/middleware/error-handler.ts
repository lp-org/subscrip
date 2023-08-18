import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";

export const errorHandlerMiddleware =
  () => (err: Error, req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = req.container.resolve("logger");

    logger.error(err);

    res.status(400).json({ error: "Error", message: err.message });
  };
