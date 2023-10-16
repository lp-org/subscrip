import { asFunction, asValue } from "awilix";
import { NextFunction, Request, RequestHandler, Response } from "express";
import passport from "passport";
import StoreService from "../services/StoreService";
import jwt from "jsonwebtoken";
export default (): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (req.cookies.jwt) {
      try {
        const user = jwt.verify(
          req.cookies.jwt,
          process.env.JWT_SECRET || ""
        ) as Express.User;

        req.user = user;
        next();
      } catch (error) {
        res.status(401).send("Unauthorized");
      }
    } else {
      res.status(401).send("Unauthorized");
    }

    // passport.authenticate(["admin-jwt"], { session: false })(req, res, next);
  };
};
