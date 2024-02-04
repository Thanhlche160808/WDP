import Post from "../models/post";
import Comment from "../models/commentBucket";

class PostService {
    async getNewFeed(userId) {
        const posts = await Post.find().populate("user");
        return posts;
    }

    async createPost(data, userId) {
        const post = new Post({
            ...data,
            user: userId,
        });
        return await post.save();
    }

    async personalPosts(userId) {
        const posts = await Post.find({ user: userId });
        return posts;
    }

    async reactPost(userId, postId, type) {
        const post = await Post.findById(postId);
        if (!post) 
            throw new Error("Post not found");
        const reactIndex = post.reacts.findIndex((react) => react.user == userId);
        if (reactIndex > -1) {
            post.reacts[reactIndex].type = type;
        } else {
            post.reacts.push({ user: userId, type });
        }
        return await post.save();
    }

    async editPost(postId, data) {
        const post = await Post.findById(postId);
        if (!post) throw new Error("Post not found");
        post.set(data);
        return await post.save();
    }

    async getPostById(postId) {
        const post = await Post.findById(postId).populate("user");
        if (!post) throw new Error("Post not found");
        return post;
    }
}

export default new PostService();
