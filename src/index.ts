import { ApolloServer } from "apollo-server";
import * as mongoose from "mongoose";

import { MONGO_URL } from "../config";
import typeDefs from "../graphql/TypeDefs";
import resolvers from "../graphql/Resolvers";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

const express = require('express');


const PORT = process.env.port || 3000;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  })

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


}

startServer();