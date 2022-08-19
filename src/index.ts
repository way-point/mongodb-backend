import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";

import { MONGO_URL } from "../config";
import typeDefs from "../graphql/TypeDefs";
import resolvers from "../graphql/Resolvers";
import { 
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled
} from "apollo-server-core";

import http = require("http");
import express = require("express");

const PORT = process.env.port || 3000;

async function startServer(PORT:string|number) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = await new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageDisabled()
    ],
  });
  
  await mongoose.connect(MONGO_URL);

  await server.start();
  await server.applyMiddleware({ app });
  await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve));
  const url = `http://localhost:${PORT}${server.graphqlPath}`;
  return {server, url};
}

if (require.main === module) {
  startServer(PORT).then(({server, url}) => {
    console.log("🚀 server running on : " + url);
  })
} 

export default startServer;