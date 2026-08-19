const BirdPost=require("../model/BirdPost");
const PhotographerProfile = require("../model/PhotographerProfile");
const Like=require("../model/LikePost");
const Comment=require("../model/CommentPost");
const Follow=require("../model/FollowCreator")
const BookMark=require("../model/BookMark");
const User = require("../model/User");
const findPostById=async(postid)=>{
    return await BirdPost.findById(postid);
}


const findAllPosts=async(userid)=>{
        return await BirdPost.find()
                .populate({
                    path:"creator",
                    select:"displayName  profileImage",
                    populate:{
                        path:"user",
                        select:"username email"
                    }
                });
}
const findBookmarkPosts = async (userid) => {
    return await BookMark.find({ user: userid })
        .populate({
            path: "post",
            populate: {
                path: "creator",
                select: "displayName profileImage",
                populate: {
                    path: "user",
                    select: "username email"
                }
            }
        });
}
const findLikeById=async(postid,userid)=>{
    return await Like.findOne({
            post:postid,
            user:userid
        });
}
const createdLike=async(postid,userid)=>{
    return await Like.create({
            post:postid,
            user:userid
        });
}

const deletedLike=async(likeid)=>{
    return await Like.findByIdAndDelete(likeid);
}
const findLikesByPostId=async(postid)=>{
    return await Like.findOne({
            post:postid
        });
}
const createdComment=async(post,user,comment)=>{
     return await Comment.create({
           post,
           user,
           comment
        });
}
const checkComment=async(postid,userid)=>{
    return await Comment.findOne({
            post:postid,
            user:userid
        });
}
const deletedComment=async(commentid)=>{
    return await Comment.findByIdAndDelete(commentid);
}

const getPost=async(postid)=>{
        return await BirdPost.findById(postid)
                .populate({
                    path:"creator",
                    select:"displayName  profileImage",
                    populate:{
                        path:"user",
                        select:"username email"
                    }
                });
}
const getComments=async(postid)=>{
        return await Comment.find({
            post:postid
        }).populate("user","username")
}
const getLikes=async(postid)=>{
        return await Like.find({
            post:postid
        })
}
const getBookmarks=async(postid)=>{
        return await BookMark.find({
            post:postid
        })
}
const checkBookMark=async(postid,userid)=>{
    return await BookMark.findOne({
            post:postid,
            user:userid
        });
}
const createdBookMark=async(postid,userid)=>{
    return await BookMark.create({
            post:postid,
            user:userid
        });
}
const deletedBookMark=async(bookmarkid)=>{
    return await BookMark.findByIdAndDelete(bookmarkid);
}
const checkFollow=async(creatorid,userid)=>{
    return await Follow.findOne({
            creator:creatorid,
            user:userid
        });
}

const createFollow=async(creatorid,userid)=>{
    return await Follow.create({
            creator:creatorid,
            user:userid
        });
}
const removeFollow=async(followid)=>{
    return await Follow.findByIdAndDelete(followid);
}
const findPostsByCreatorid=async(creatorid)=>{
    return await BirdPost.find({
                creator:creatorid
        }).populate({
                path: "creator",
                select: "displayName profileImage",
                populate: {
                    path: "user",
                    select: "username"
                }
            });
}
const findCreatorById=async(creatorid)=>{
    return await PhotographerProfile.findById(creatorid);
}

const getCreatorWithEmail=async(creatorid)=>{
    return await PhotographerProfile.findById(creatorid)
                                .populate({
                                    path: "user",
                                    select: "username email"
                                })
}
const findFollowersByCreatorid=async(creatorid)=>{
    return await Follow.find({
                        creator:creatorid});
}

// const findFollowingByUserid=async(userid)=>{
//     return await Follow.find({
//                             user: {
//                                 $in:userid
//                             }});
// }
const findFollowingByUserid = async (userId) => {

    return await Follow.find({
        user: userId
    }).select("creator");

};
const findFollowersByUserid=async(userid)=>{
    return await Follow.find({
                        user:userid});
}
const findFollowersAccountsByUserid=async(userid)=>{
    return await Follow.find({
                        user:userid})
                        .populate({
                                    path: "creator"
                                })
}
module.exports={
    findPostById,
    findAllPosts,
    findBookmarkPosts,
    findLikeById,
    createdLike,
    getPost,
    getLikes,
    getBookmarks,
    deletedLike,
    createdComment,
    checkComment,
    getComments,
    deletedComment,
    checkBookMark,
    createdBookMark,
    deletedBookMark,
    checkFollow,
    createFollow,
    removeFollow,
    findLikesByPostId,
    findPostsByCreatorid,
    findCreatorById,
    getCreatorWithEmail,
    findFollowersByCreatorid,
    findFollowingByUserid,
    findFollowersByUserid,
    findFollowersAccountsByUserid
}