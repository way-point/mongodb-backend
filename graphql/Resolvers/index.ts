import PostResolvers from "./posts";
import UserResolvers from "./users";

const Resolver = {
  Query: {
    ...PostResolvers.Query,
  },
  Mutation: {
    ...UserResolvers.Mutation,
    ...PostResolvers.Mutation,
  },
};

export default Resolver;