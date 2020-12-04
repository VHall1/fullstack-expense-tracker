import cors from "cors";
import express from "express";
import { createConnection } from "typeorm";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ExpensesResolver } from "./resolvers/expenses";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import connectRedis from "connect-redis";
import redis from "redis";
import { MyContext } from "./types";

const main = async () => {
  await createConnection();
  const app = express();
  const port = 4000;

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({ host: "localhost", port: 6379 });

  app.use(
    cors({
      credentials: true,
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.NODE_FRONT_END
          : "http://localhost:3000",
    })
  );

  // app.set("trust proxy", 1);
  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redisClient }),
      secret: process.env.NODE_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 365,
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ExpensesResolver, UserResolver],
    }),
    context: ({ req, res }: MyContext) => ({
      req,
      res,
      session: req.session,
      redisClient,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
};

main().catch((err) => console.error(err));
