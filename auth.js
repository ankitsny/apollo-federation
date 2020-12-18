import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildFederatedSchema } from "@apollo/federation";

import { typeDefs, resolvers } from "./authSchema";

const app = express();
app.use(express.json());

const apolloServer = new ApolloServer({
  schema: buildFederatedSchema({ typeDefs, resolvers }),
  context: ({ req, res }) => ({ req, res }),
});

apolloServer.applyMiddleware({ app, cors: false });

app.listen(Number(process.env.AUTH_PORT));
console.log(
  `Auth server started at domain ${process.env.AUTH_DOMAIN}:${process.env.AUTH_PORT}`
);
