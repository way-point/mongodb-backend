import { UserInputError, AuthenticationError } from "apollo-server";
import { JwtPayload } from "jsonwebtoken";

import Post from "../../models/Post";
import checkAuth from "../../Utils/checkAuth";

const CommentResolver = {
  Mutation: {
    createComment: async (parent, { postId, body }, context) => {
      const { username } = checkAuth(context) as JwtPayload;
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "Comment body must not be empty",
          },
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
    deleteComment: async (parent, { postId, commentId }, context) => {
      const { username } = checkAuth(context) as JwtPayload;

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex((c: any) => c.id === commentId);

        if (commentIndex === -1) {
          throw new UserInputError("Comment not found");
        }

        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Post not found");
      }
    },
    likePost: async (parent, { postId }, context) => {
      const { username } = checkAuth(context) as JwtPayload;
      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          post.likes = post.likes.filter((likes) => likes.username !== username);
        } else {
          post.likes.unshift({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },
};

export default CommentResolver;
