import { asValue } from "awilix";
import { NextFunction, Request, Response } from "express";

export const authMiddleware =
  () => (req: Request, res: Response, next: NextFunction) => {
    // We want a new scope for each request!

    // The `TodosService` needs `currentUser`

    req.container.register({
      currentUser: asValue(req.headers.userid), // from auth middleware... IMAGINATION!! :D
    });
    const userid: string = req.headers.userid as string;
    req.user = userid;
    return next();
  };
