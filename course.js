import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { buildFederatedSchema } from "@apollo/federation";
import { typeDefs, resolvers } from "./courseSchema";
import { authCheck } from "./middleware";

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

app.listen(process.env.COURSE_PORT);
console.log(
  `Course server started at domain ${process.COURSE_DOMAIN}:${process.env.COURSE_PORT}`
);
