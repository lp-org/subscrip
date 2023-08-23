import connectRedis from "connect-redis";

// import cookieParser from "cookie-parser";
import { Express } from "express";
import session, { SessionOptions } from "express-session";
// import morgan from "morgan";
import * as redis from "redis";

type Options = {
  app: Express;
};

export default async ({ app }: Options): Promise<Express> => {
  let sameSite: "none" | boolean = true;
  let secure = false;
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "staging"
  ) {
    secure = true;
    sameSite = "none";
  }

  //   const { cookie_secret, session_options } = configModule.projectConfig;
  //   const sessionOpts = {
  //     name: session_options?.name ?? "connect.sid",
  //     resave: session_options?.resave ?? true,
  //     rolling: session_options?.rolling ?? false,
  //     saveUninitialized: session_options?.saveUninitialized ?? true,
  //     proxy: true,
  //     secret: session_options?.secret ?? cookie_secret,
  //     cookie: {
  //       sameSite,
  //       secure,
  //       maxAge: session_options?.ttl ?? 10 * 60 * 60 * 1000,
  //     },
  //     store: null,
  //   };
  const sessionParams: SessionOptions = {
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite,
      secure,
      maxAge: 10 * 60 * 60 * 1000,
    },
  };

  if (process.env.REDIS_URL) {
    const redisClient = redis.createClient({
      url: process.env.REDIS_URL,
    });
    redisClient.connect();
    redisClient.on("connect", () => console.log("Redis Client Connected"));
    redisClient.on("error", (err) =>
      console.log("Redis Client Connection Error", err)
    );
    const redisStore = new connectRedis({
      client: redisClient,
    });

    sessionParams.store = redisStore;
  }

  //   app.set("trust proxy", 1)
  //   app.use(
  //     morgan("combined", {
  //       skip: () => process.env.NODE_ENV === "test",
  //     })
  //   )
  //   app.use(cookieParser())
  //   app.use(session(sessionOpts))

  //   app.get("/health", (req, res) => {
  //     res.status(200).send("OK")
  //   })
  app.use(session(sessionParams));

  return app;
};
