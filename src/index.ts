import { gql } from "apollo-server";
import { ApolloServer } from "apollo-server";
import * as mongoose from "mongoose";

import Post from "../models/Post";
import { MONGO_URL } from "../config";
import typeDefs from "../graphql/TypeDefs";
import resolvers from "../graphql/Resolvers";

const PORT = process.env.port || 3000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => {
    console.error(err);
  });
