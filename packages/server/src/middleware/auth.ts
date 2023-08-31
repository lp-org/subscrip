import { asFunction, asValue } from "awilix";
import { NextFunction, Request, RequestHandler, Response } from "express";
import passport from "passport";
import StoreService from "../services/StoreService";

export default (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(["admin-jwt"], { session: false })(req, res, next);
  };
};
