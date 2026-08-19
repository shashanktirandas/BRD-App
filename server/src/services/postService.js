
const bcrypt=require("bcryptjs");
const mail=require("../services/mailService")
const config=require("../config/config")
const otpGenerator=require("otp-generator");
const { interactionService } = require("../modules/recommendation");
const InteractionTypes = require("../modules/recommendation/constants/interaction.types");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    ValidationError
}=require("../errors/AppError");
const logger=require("../utils/logger");
const LOG_EVENTS = require("../constants/logEvents");

const mongoose=require("mongoose");
const jwt=require("jsonwebtoken")
const {
    findPostById,
    findAllPosts,
    findBookmarkPosts,
    findLikeById,
    createdLike,
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
    findFollowersAccountsByUserid,
    getPost
}=require("../repository/post_repository");
const logEvents = require("../constants/logEvents");

const recommandPostsService=async(userId)=>{
        const allPosts=await findAllPosts(userId);
        if(allPosts.length === 0){
            throw new NotFoundError("Posts not found");
        }
       return {
        count:allPosts.length,
        posts: allPosts
       };
}

const bookmarkPostsService=async(userId)=>{
        const allPosts=await findBookmarkPosts(userId);
        if(allPosts.length === 0){
            throw new NotFoundError("Posts not found");
        }//const bookmarks = await Bookmark.find({ user: userId })
    //.populate("post");
       return {
        count:allPosts.length,
        posts: allPosts
       };
}

const getPostService=async(postId)=>{
        const post=await getPost(postId);
        if(!post){
            throw new NotFoundError("post not found");
        }
       return post;
}

// const likePostService=async(postId,userId)=>{
        
//         const post=await findPostById(postId);
//         if(!post){
//             throw new NotFoundError("Posts not found");
//         }
//         const LikeExist=await findLikeById(postId,userId);
//         if(LikeExist){
//             throw new BadRequestError("like already exists");
//         }
//         return await createdLike(postId,userId);
        
// }
const likePostService = async (postId, userId) => {

    const post = await findPostById(postId);

    if (!post) {
        throw new NotFoundError("Posts not found");
    }

    const likeExist = await findLikeById(postId, userId);

    if (likeExist) {
        throw new BadRequestError("Like already exists");
    }

    const like = await createdLike(postId, userId);

    interactionService.record({
                userId: userId,
                post,
                interactionType: InteractionTypes.LIKE
            });
    return like;

}
const unlikePostService=async(postId,userId)=>{
        
        const post=await findPostById(postId);
        if(!post){
            throw new NotFoundError("Posts not found");
        }
        const LikeExist=await findLikeById(postId,userId);
        if(!LikeExist){
            throw new BadRequestError("like not found");
        }
        const dislike = await deletedLike(LikeExist._id);

        interactionService.record({
            userId: userId,
            post: post,
            interactionType: InteractionTypes.UNLIKE
        });

        return dislike;
        
}

const commentPostService=async(postId,comment,userId)=>{
        
        const post=await findPostById(postId);
        if(!post){
            throw new NotFoundError("Posts not found");
        }
       const newComment = await createdComment(postId, userId, comment);

        interactionService.record({
            userId: userId,
            post: post,
            interactionType: InteractionTypes.COMMENT,
            metadata: {
                commentLength: comment.length
            }
        });

        return newComment;
}
const removeCommentPostService=async(postId,userId)=>{
        const post=await findPostById(postId);
        if(!post){
            throw new NotFoundError("Posts not found");
        }
        const CommentExist=await checkComment(postId,userId);
        if(!CommentExist){
            throw new BadRequestError("comment not found");
        }
        const deletedCommentResult = await deletedComment(CommentExist._id);

        interactionService.record({
            userId: userId,
            post: post,
            interactionType: InteractionTypes.DELETE_COMMENT
        });

        return deletedCommentResult;
}

const FollowCreatorService=async(creatorId,userId)=>{
        const creator=await findCreatorById(creatorId);
        if(!creator){
            throw new NotFoundError("creator not found");
        }
        const FollowExist=await checkFollow(creatorId,userId);
        if(FollowExist){
            throw new BadRequestError("follow already exists");
        }
        const follow = await createFollow(creatorId, userId);

        interactionService.record({
            userId: userId,
            creator: creatorId,
            interactionType: InteractionTypes.FOLLOW
        });

        return follow;
}

const unFollowCreatorService=async(creatorId,userId)=>{
        const creator=await findCreatorById(creatorId);
        if(!creator){
            throw new NotFoundError("creator not found");
        }
        const FollowExist=await checkFollow(creatorId,userId);
        if(!FollowExist){
            throw new BadRequestError("follow didnt exist for this post");
        }
        const unfollow = await removeFollow(FollowExist._id);

        interactionService.record({
            userId: userId,
            creator: creatorId,
            interactionType: InteractionTypes.UNFOLLOW
        });

        return unfollow;
}

const FollowPostCreatorService=async(postId,userId)=>{
        const post=await findPostById(postId);
        if(!post){
            throw new NotFoundError("Posts not found");
        }
        const creator=await findCreatorById(post.creator);
        if(!creator){
            throw new NotFoundError("creator not found");
        }
        const FollowExist=await checkFollow(post.creator,userId);
        if(FollowExist){
            throw new BadRequestError("follow already exists");
        }
        return await createFollow(creator._id,userId);
}

const unFollowPostCreatorService=async(postId,userId)=>{
        const post=await findPostById(postId);
        if(!post){
            throw new NotFoundError("Posts not found");
        }
        const creator=await findCreatorById(post.creator);
        if(!creator){
            throw new NotFoundError("creator not found");
        }
        const FollowExist=await checkFollow(post.creator,userId);
        if(!FollowExist){
            throw new BadRequestError("follow didnt exist for this post");
        }
        return await removeFollow(FollowExist._id);
}


const bookmarkPostService=async(postId,userId)=>{
        const post=await findPostById(postId);
        if(!post){
            throw new NotFoundError("Posts not found");
        }
        const BookMarkExist=await checkBookMark(postId,userId);
        if(BookMarkExist){
            throw new BadRequestError("bookmark already exists");
        }
        const bookmark = await createdBookMark(postId, userId);

        interactionService.record({
            userId: userId,
            post: post,
            interactionType: InteractionTypes.BOOKMARK
        });

        return bookmark;
}

const removeBookmarkPostService=async(postId,userId)=>{
        const post=await findPostById(postId);
        if(!post){
            throw new NotFoundError("Posts not found");
        }
        const BookMarkExist=await checkBookMark(postId,userId);
        if(!BookMarkExist){
            throw new BadRequestError("bookmark not found");
        }
        const bookmark = await deletedBookMark(BookMarkExist._id);

        interactionService.record({
            userId: userId,
            post: post,
            interactionType: InteractionTypes.REMOVE_BOOKMARK
        });

        return bookmark;

}


//get data

const getCommentsService=async(postId)=>{
        const post=await findPostById(postId);
        if(!post){
            throw new NotFoundError("Posts not found");
        }
        const comments= await getComments(postId);
        if(comments.length === 0){
            throw new NotFoundError("comments not found");
        }
        return comments;
}

const getLikesService=async(postId)=>{
        const post=await findPostById(postId);
        if(!post){
            throw new NotFoundError("Posts not found");
        }
        return await getLikes(postId);    
}
const getBookmarksService=async(postId)=>{
        const post=await findPostById(postId);
        if(!post){
            throw new NotFoundError("Posts not found");
        }
        return await getBookmarks(postId);    
}
const getIsLikedService=async(postId,userId)=>{
        const post=await findPostById(postId);
        // logger.info({
        //  message:"post",
        //  post:post   
        // })
        if(!post){
            throw new NotFoundError("Posts not found");
        }
        
        const like= await findLikeById(postId,userId);
        if(like){
            return {
                event:"user liked that creator",
                data:{
                    like:true
                }
            }
        }else{
            return {
                event:"user didnt liked that creator",
                data:{
                    like:false
                }
            }
        }
}

const getIsFollowService=async(creatorId,userId)=>{
        
        const creator=await findCreatorById(creatorId);

        if(!creator){
            throw new BadRequestError("invalid creator id!");
        }
        const follow= await checkFollow(creatorId,userId);
        if(!follow){
            return {
                message:"user didnt followed that creator",
                data:{
                    follow:false
                }
            }
        }else{
            return {
                message:"user followed that creator",
                data:{
                    follow:true
                }
            }
        }
}

const getPostIsFollowService=async(postId,userId)=>{
        const post=await findPostById(postId);
        if(!post){
            throw new NotFoundError("Posts not found");
        }
        const creator=await findCreatorById(post.creator);

        if(!creator){
            throw new BadRequestError("invalid creator id!");
        }
        const follow= await checkFollow(post.creator,userId);
        if(!follow){ 
            return {
                message:"user didnt followed that creator",
                data:{
                    follow:false
                }
            }
        }else{
            return {
                message:"user followed that creator",
                data:{
                    follow:true
                }
            }
        }
}

const getIsBookmarkService=async(postId,userId)=>{
        const post=await findPostById(postId);
        if(!post){
            throw new NotFoundError("Posts not found");
        }
        const bookmark= await checkBookMark(post._id,userId);
        if (!bookmark) {
            return {
                message:"user didnt bookmaerked the post",
                data:{
                    bookmark:false
                }
            }
        }else{
            return {
                message:"user bookmaerked the post",
                data:{
                    bookmark:true
                }
            }
        }
}

const getCreatorPostsService=async(creatorId)=>{
        const creator=await findCreatorById(creatorId);
        if(!creator){
            throw new BadRequestError("invalid creator id!");
        }
        const Posts= findPostsByCreatorid(creatorId);
        if(Posts.length === 0){
            throw new NotFoundError("Posts not found");
        }
        return Posts;
}

const getCreatorService=async(creatorId)=>{
        const creator=await getCreatorWithEmail(creatorId);
        if(!creator){
            throw new BadRequestError("invalid creator id!");
        }
        return creator;
}

const getCreatorfollowersService=async(creatorId)=>{
        const creator=await findCreatorById(creatorId);
        if(!creator){
            throw new BadRequestError("invalid creator id!");
        }
        const followers=await findFollowersByCreatorid(creatorId); 
        if(followers.length === 0){
            return {
                event:"no followers exist",
                data:{
                    exist:false,
                    count:followers.length
                }
            }
        }else{
            return {
                event:"creators followers retrived",
                data:{
                    exist:true,
                    count:followers.length
                }
            }
        }
}

const getCreatorfollowingService=async(creatorId)=>{
        const creator=await findCreatorById(creatorId);
        if(!creator){
            throw new BadRequestError("invalid creator id!");
        }
        const followers= await findFollowingByUserid(creator.user);
        if(followers.length === 0){
            return{
                event:"no following accounts exist",
                data:{
                    exist:false,
                    count:followers.length
                }
            }
        }else{
            return {
                event:"creators following accounts retrived",
                data:{
                    exist:true,
                    count:followers.length
                }
            }
        }
    
}

const getUserfollowingService=async(userId)=>{
        const followers= await findFollowersByUserid(userId);
        if(followers.length === 0){
            return {
                event:"no following accounts exist",
                data:{
                    exist:false,
                    count:followers.length
                }
            }
        }else{
            return {
                event:"user following accounts retrived",
                data:{
                    exist:true,
                    count:followers.length
                }
            }
        }

}

const getUserfollowingAccountsService=async(userId)=>{
        const followers= await findFollowersAccountsByUserid(userId);
        if(followers.length === 0){
            return {
                event:"no following accounts exist",
                data:{
                    exist:false,
                    count:followers.length,
                    accounts:followers
                }
            }
        }else{
            return {
                event:"user following accounts retrived",
                data:{
                    exist:true,
                    count:followers.length,
                    accounts:followers
                }
            }
        }

}



module.exports={
    recommandPostsService,
    bookmarkPostsService,
    likePostService,
    unlikePostService,
    commentPostService,
    FollowCreatorService,
    unFollowCreatorService,
    FollowPostCreatorService,
    unFollowPostCreatorService,
    bookmarkPostService,
    removeBookmarkPostService,
    getPostService,
    getCommentsService,
    getLikesService,
    getBookmarksService,
    getIsLikedService,
    getIsBookmarkService,
    getIsFollowService,
    getPostIsFollowService,
    getCreatorPostsService,
    getCreatorService,
    getCreatorfollowersService,
    getCreatorfollowingService,
    getUserfollowingService,
    getUserfollowingAccountsService,
}

