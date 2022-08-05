import { gql } from "apollo-server";

const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

// const typeDefs = require('./graphql/typeDefs');
// const resolvers = require('./graphql/resolvers');

import { MONGO_URL } from "../config";

const typeDefs = gql`
  type Query {
    sayHi: String!
  }
`;

const resolvers = {
  Query: {
    sayHi: () => {
      return "Hello World";
    },
  },
};

const PORT = process.env.port || 3000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch(err => {
    console.error(err)
  })