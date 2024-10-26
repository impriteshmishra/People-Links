import { User } from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';


// registering user
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try different email.",
                success: false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}

//login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password!",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password!",
                success: false,
            });
        };
        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        //populate each post in the post array
        const populatePosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        )

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatePosts
        }


        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });
    } catch (error) {
        console.log("what error");

        console.log(error);
    }
};
//logout user
export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
//get profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select('-password');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
// edit profile
export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudeResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudeResponse = await cloudinary.uploader.upload(fileUri);
        }
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudeResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: "Profile updated.",
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
    }
}
//get suggested users
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password"); //$ne:req.id means that not equal to req.id.-password means eliminate password.
        if (!suggestedUsers) {
            return res.status(400).json({
                message: "Currently do not have any users",
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};
// follow and unfollow
// export const followOrUnfollow = async (req,res)=>{
//     try {
//         const joFollowKarega = req.id; //user who currently loggedIn
//         const jiskoFollowKarna = req.params.id // another id jisko follow karna
//         if(joFollowKarega===jiskoFollowKarna){
//           return res.status(400).json({
//             message:'You can not follow/unfollow yourself',
//             success:false
//           });
//         } 

//         const user = await User.findById(joFollowKarega);
//         const targetUser = await User.findById(jiskoFollowKarna);
//         if(!user || !targetUser){
//             return res.status(400).json({
//                 message:'User not found',
//                 success:false,
//             });
//         }
//         //Checking that folllow karna hai ya unfollow karna hai.
//         // const isFollowing = user.following.includes(jiskoFollowKarna); // includes help karega check karne mein. if alreday follow hai to true return karega.
//         const isFollowing = user.following.includes(jiskoFollowKarna); // Check if following exists before using includes

//         if(isFollowing){
//            // includes agar true hai to iska matlab already follow hai. so here we give unfollow logic
//            await Promise.all([
//            User.updateOne({_id:joFollowKarega},{$pull:{following:jiskoFollowKarna}}),// user ke id mein update karga following ko
//             User.updateOne({_id:jiskoFollowKarna},{$pull:{followers:joFollowKarega}}), // jisko unfollow kia uske followers mein update karega.
//         ])
//         return res.status(200).json({
//             message:"unfollowed successfully", 
//             success:true,
//         })
//         }else{
//           // follow logic
//           await Promise.all([
//             User.updateOne({_id:joFollowKarega},{$push:{following:jiskoFollowKarna}}),// user ke id mein update karga following ko
//             User.updateOne({_id:jiskoFollowKarna},{$push:{followers:joFollowKarega}}), // jisko follow kia uske followers mein update karega.
//           ])
//           return res.status(200).json({
//             message:"followed successfully", 
//             success:true,
//         })
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }



export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id;
        const jiskoFollowKrunga = req.params.id;
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        // mai check krunga ki follow krna hai ya unfollow

        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            // unfollow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
        console.log(error);
    }
}