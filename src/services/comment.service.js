// ** Schema
import Comment from '../models/commentBucket';
import User from '../models/user';
import postService from './post.service';

class CommentService {
    async newComment({postId, userId, content, image, reply = [], reacts}) {
        const post = await postService.getPostById(postId);
        const user = await User.findById(userId);
        const commentBucket = await Comment.findOneAndUpdate(
            {
                commentId: new RegExp(`^${postId.id}_`),
                count: {$lt: 15}
            },
            {
                post: post,
                $push: {
                    comments: {
                        user: user,
                        content,
                        image,
                        reacts,
                        replies: reply
                    }
                },
                $inc: {count: 1},
                $setOnInsert: {
                    commentId: new RegExp(`^${postId.id}_`),
                }
            },
            {
                new: true,
                upsert: true
            }
        );
        if (commentBucket.comments.length === 1) {
            const prevBucket = await Comment.findOne({
                commentId: new RegExp(`^${postId.id}_`)
            })
                .sort({post: -1})
                .skip(commentBucket.page);
            
            if (prevBucket) {
                commentBucket.page = prevBucket.page + 1;
                await commentBucket.save();
            }
        }
        return {
            commentBucket,
            user,
        }
    }
}

export default new CommentService();