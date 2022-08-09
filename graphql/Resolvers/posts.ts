import { AuthenticationError } from "apollo-server";
import { JwtPayload } from "jsonwebtoken";
import Post from "../../models/Post";
import checkAuth from "../../Utils/checkAuth";

const PostResolver = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(parent, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createPost(parent, { body }, context) {
      const user = checkAuth(context) as JwtPayload;
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();
      return post;
    },
    async deletePost(parent, { postId }, context) {
      const user = checkAuth(context) as JwtPayload;

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted Successfully";
        } else {
          throw new AuthenticationError("Action not Allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

export default PostResolver;
