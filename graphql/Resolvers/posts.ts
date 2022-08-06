import Post from "../../models/Post";

const PostResolver = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch(err) {
        throw new Error(err);
      }
    }
  }
}

export default PostResolver;
