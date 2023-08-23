import { Express } from "express";
import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { Strategy as JWTStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import AuthService from "../services/AuthService";
import { AwilixContainer } from "awilix";

export default async ({
  app,
  container,
}: {
  app: Express;
  container: AwilixContainer;
}): Promise<void> => {
  // For good old email password authentication
  const authService: AuthService = container.resolve("authService");
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await authService.authenticate(email, password);
          if (user) {
            return done(null, { userId: user.id });
          } else {
            return done("Incorrect Username / Password");
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // After a user has authenticated a JWT will be placed on a cookie, all
  // calls will be authenticated based on the JWT
  const jwt_secret = process.env.JWT_SECRET || "secret";
  passport.use(
    "admin-jwt",
    new JWTStrategy(
      {
        // @ts-ignore
        jwtFromRequest: (req) => req.session.jwt,
        secretOrKey: jwt_secret,
      },
      async (jwtPayload, done) => {
        return done(null, jwtPayload);
      }
    )
  );

  passport.use(
    "store-jwt",
    new JWTStrategy(
      {
        // @ts-ignore
        jwtFromRequest: (req) => req.session.jwt_store,
        secretOrKey: jwt_secret,
      },
      async (jwtPayload, done) => {
        return done(null, jwtPayload);
      }
    )
  );

  // Alternatively use bearer token to authenticate to the admin api
  //   passport.use(
  //     new BearerStrategy(async (token, done) => {
  //       const auth = await authService.authenticateAPIToken(token);
  //       if (auth.success) {
  //         done(null, auth.user);
  //       } else {
  //         done(auth.error);
  //       }
  //     })
  //   );

  app.use(passport.initialize());
  app.use(passport.session());
};
