import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { buildFederatedSchema } from "@apollo/federation";

import { typeDefs, resolvers } from "./studentSchema";
import { authCheck } from "../middlewares/middleware";

const app = express();

app.use(cookieParser());
app.use(authCheck());

const apolloServer = new ApolloServer({
  schema: buildFederatedSchema({
    typeDefs,
    resolvers,
  }),
  context: (req, res) => ({ req, res }),
});

apolloServer.applyMiddleware({ app, cors: false });

app.listen(Number(process.env.STUDENT_PORT));
console.log(`Student server started at domain ${process.env.STUDENT_DOMAIN}`);
