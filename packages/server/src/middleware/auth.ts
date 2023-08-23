import { asFunction, asValue } from "awilix";
import { NextFunction, Request, RequestHandler, Response } from "express";
import passport from "passport";

export default (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(["admin-jwt"], { session: false })(req, res, next);
    console.log("register user 2");
    req.container.register({
      currentUser: asFunction(() => req.user).scoped(),
    });
  };
};
