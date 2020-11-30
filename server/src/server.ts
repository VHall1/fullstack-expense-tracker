import cors from "cors";
import express from "express";
import { createConnection } from "typeorm";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ExpensesResolver } from "./resolvers/expenses";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  await createConnection();

  const app = express();
  const port = 8080;

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ExpensesResolver, UserResolver],
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.use(cors());

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
};

main().catch((err) => console.error(err));
