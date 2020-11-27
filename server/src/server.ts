import cors from "cors";
import express from "express";
import { createConnection } from "typeorm";
import errorHandler from "./errors/handler";
import "express-async-errors";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";

import { buildSchema } from "type-graphql";
import { ExpensesResolver } from "./resolvers/expenses";

const main = async () => {
  await createConnection();

  const app = express();
  const port = 8080;

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ExpensesResolver],
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.use(cors());
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
};

main().catch((err) => console.error(err));
