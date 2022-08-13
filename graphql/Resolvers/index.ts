import PostResolvers from "./posts";
import UserResolvers from "./users";
import CommentResolvers from "./comments";

const Resolver = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...PostResolvers.Query,
    ...UserResolvers.Query
  },
  Mutation: {
    ...UserResolvers.Mutation,
    ...PostResolvers.Mutation,
    ...CommentResolvers.Mutation,
  },
};

export default Resolver;
