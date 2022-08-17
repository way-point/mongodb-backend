import { ApolloServer } from "apollo-server-express";
import * as mongoose from "mongoose";

import { MONGO_URL } from "../config";
import typeDefs from "../graphql/TypeDefs";
import resolvers from "../graphql/Resolvers";
import { 
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginDrainHttpServer
} from "apollo-server-core";

import http = require('http');
import express = require('express');

const PORT = process.env.port || 3000;

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  });
  
  
  mongoose
    .connect(MONGO_URL)
    .then(async () => {
      await server.start();
      server.applyMiddleware({ app });
      await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve));
    })
    .then(() => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    })
    .catch((err) => {
      console.error(err);
    });
}

startServer();