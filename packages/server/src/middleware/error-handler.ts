import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";
import { ZodError } from "zod";

export const errorHandlerMiddleware =
  () => (err: Error, req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = req.container.resolve("logger");
    logger.info(err);
    if (err instanceof ZodError) {
      res.status(400).json({ error: "invalid input", message: err.issues });
      return;
    }

    res.status(400).json({ error: "Error", message: err.message });
  };
