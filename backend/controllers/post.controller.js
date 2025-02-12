import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from '../models/post.model.js';
import { User } from "../models/user.model.js";
import { Comment } from '../models/comment.model.js';
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) return res.status(400).json({ message: 'Image required' });

        //uploading image
        //The typical use case for this high speed Node-API module is to convert large images in common formats to smaller, web-friendly JPEG, PNG, WebP, GIF and AVIF images of varying dimensions.
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // buffer to data uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudeResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudeResponse.secure_url,
            author: authorId
        });
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New post created',
            post,
            success: true,
        })

    } catch (error) {
        console.log("what error");
        
        console.log(error);
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({ path: 'author', select: 'username profilePicture' }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'author',
                select: 'username profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'username, profilePicture'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'author',
                select: 'username, profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const likePost = async (req, res) => {
    try {
        const idOfPersonWhoLike = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            })
        }

        //logic of like
        await post.updateOne({ $addToSet: { likes: idOfPersonWhoLike } });
        await post.save();

        //implementing socket io for real time notification
        const user = await User.findById(idOfPersonWhoLike).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId!==idOfPersonWhoLike){
            // emit a notifiaction event
            const notification = {
                type:'like',
                userId:idOfPersonWhoLike,
                userDetails:user,
                postId,
                message:`${user.username} likes your post.`
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId)
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({
            message: 'Post Liked',
            success: true
        })
    }
    catch (error) {
        console.log(error);
    }
}


export const disLikePost = async (req, res) => {
    try {
        const idOfPersonWhoDislike = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            })
        }

        //logic of like
        await post.updateOne({ $pull: { likes: idOfPersonWhoDislike } });
        await post.save();

        //implementing socket io for real time notification
        const user = await User.findById(idOfPersonWhoDislike).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId!==idOfPersonWhoDislike){
            // emit a notifiaction event
            const notification = {
                type:'dislike',
                userId:idOfPersonWhoDislike,
                userDetails:user,
                postId
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId)
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({
            message: 'Post Disliked',
            success: true
        })
    }
    catch (error) {
        console.log(error);
    }
}

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const idOfPersonWhoComment = req.id;

        const { text } = req.body;

        const post = await Post.findById(postId);

        if (!text) {
            return res.status(400), json({
                message: 'text is required',
                success: false
            })
        }
        const comment = await Comment.create({
            text,
            author: idOfPersonWhoComment,
            post: postId
        })
        await comment.populate({
            path: 'author',
            select: "username profilePicture"
        });
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: 'Comment Added',
            comment,
            success: true
        })
    }
    catch (error) {
        console.log(error);
    }
};

export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture');

        if (!comments) {
            return res.status(404).json({
                message: 'comments not found',
                success: false
            });
        }
        return res.status(200).json({
            success: true,
            comments
        });
    }
    catch (error) {
        console.log(error);
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            })
        }

        // check user who logged in is user of the post
        if (post.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'Unauthorized user'
            });
        }

        // deleting post
        await Post.findByIdAndDelete(postId);


        //handle the important case i.e remove the post id from the users post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // delete associated comments
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            success: true,
            message: 'Post deleted'
        })
    }
    catch (error) {
        console.log(error);

    }
};

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }
        const user = await User.findById(authorId);

        //if already bookmarked so we have to remove it from bookmark
        if (user.bookmarks.includes(post._id)) {
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                type: 'unsaved',
                message: 'Post removed from bookmark',
                success: true
            });
        } else {
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                type: 'saved',
                message: 'Post added to bookmark',
                success: true
            });
        }
    }
    catch (error) {
        console.log(error);

    }
};
