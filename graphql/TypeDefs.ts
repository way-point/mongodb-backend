import { makeExecutableSchema } from "@graphql-tools/schema";
import { gql } from "apollo-server-express";
import descriptionDirective from "./directives";

const { descriptionDirectiveTypeDefs, descriptionDirectiveTransformer } =
  descriptionDirective("description");

const typeDefs = gql`
  type Comment {
    id: ID! @deprecated(reason: "example of id depreciated")
    createdAt: String! @description(value: "createdAt description")
    username: String!
    body: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type User {
    id: ID!
    email: String!
    access_token: String!
    refresh_token: String!
    access_token_expires_at: Int!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    email: String!
  }
  input LoginInput {
    username: String!
    password: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    ifUserFound(username: String): Boolean
  }
  type Mutation {
    register(registerInput: RegisterInput!): User!
    login(loginInput: LoginInput!): User!
    refreshToken(refreshToken: String!): String!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [
    descriptionDirectiveTypeDefs, typeDefs
  ]
});

export default descriptionDirectiveTransformer(schema);
