const BirdPost = require("../model/BirdPost");
const PhotographerProfile = require("../model/PhotographerProfile");
const Like=require("../model/LikePost");
const Comment=require("../model/CommentPost");
const Follow=require("../model/FollowCreator")
const BookMark=require("../model/BookMark");
const User = require("../model/User");

const config=require("../config/config");
const logger=require("../utils/logger");
const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
    }=require("../errors/AppError");
//const successResponse = require("./successResponse");
const {
    recommendationService,
    interactionService,
    similarPostService
} = require("../modules/recommendation");


const {
    recommandPostsService,
    bookmarkPostsService,
    getPostService,
    likePostService,
    unlikePostService,
    commentPostService,
    FollowCreatorService,
    unFollowCreatorService,
    FollowPostCreatorService,
    unFollowPostCreatorService,
    bookmarkPostService,
    removeBookmarkPostService,
    getCommentsService,
    getLikesService,
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
    getBookmarksService,
}=require("../services/postService");
const { email } = require("zod");
const { getCreatorsService } = require("../services/creatorService");
const successResponse = require("./successResponse");

const welcome=async(req,res)=>{
        const {username,email,role}=req.accessToken;
        logger.info(res,{
            message:`welcome ${username} `
        })
        successResponse(res,{
            message:`Successfully retrived user details.`,
            data:{
                username:username,
                email:email,
                role:role
            }
        }) 
}
const getPosts = async (req, res) => {

    console.log("PAGINATION QUERY:", req.query);

    const page =
        Math.max(
            1,
            parseInt(req.query.page) || 1
        );

    const limit =
        Math.min(
            20,
            Math.max(
                1,
                parseInt(req.query.limit) || 10
            )
        );

    const excludePostIds =
        req.query.excludeIds
            ? req.query.excludeIds.split(",")
            : [];

    const menuType =
        req.query.menuType || null;

    const menuValue =
        req.query.menuValue || null;

    console.log("PAGE:", page);
    console.log("LIMIT:", limit);
    console.log(
        "EXCLUDE IDS:",
        excludePostIds.length
    );

    console.log("MENU TYPE:", menuType);
    console.log("MENU VALUE:", menuValue);

    const feed =
        await recommendationService.getHomeFeed(
            req.accessToken.userid,
            limit,
            page,
            excludePostIds,
            menuType,
            menuValue
        );

    successResponse(res, {
        message: `Successfully retrieved all posts.`,
        data: feed
    });
};

const viewPost = async (req, res) => {

    await interactionService.record({
        userId: req.accessToken.userid,

        post: {
            _id: req.params.id
        },

        interactionType: "VIEW",

        duration:
            Number(req.body?.duration) || 0
    });

    successResponse(res, {
        message: "Post view recorded successfully."
    });
};

const getSimilarPosts = async (req, res) => {

    try {

        const result = await similarPostService.getSimilarPosts({
            postId: req.params.id,
            limit: 10,
            menuSelection: {
                type: req.query.menuType || null,
                value: req.query.menuValue || null
            }
        });
        successResponse(res, {
            message:
                "Similar posts retrieved successfully.",
            data: result
        });

    } catch (error) {

        console.error(
            "❌ SIMILAR POST ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getBookmarkedPosts=async(req,res)=>{
        const post=await bookmarkPostsService(req.accessToken.userid);
        successResponse(res,{
            message:`Successfully retrived all posts.efdfg`,
            data:post
        }) 
}

const getPost=async(req,res)=>{
        const post=await getPostService(req.params.id);
        successResponse(res,{
            message:`Successfully retrived all posts.`,
            data:post
        })
}

const likePost=async(req,res)=>{
        const postid=req.params.id;
        const like=await likePostService(req.params.id,req.accessToken.userid);
        successResponse(res,{
            message:"Liked post",
            data:{
                like
            }
        })
}

const disLikePost=async(req,res)=>{
        const postid=req.params.id;
        const dislike=await unlikePostService(req.params.id,req.accessToken.userid);
        successResponse(res,{
            message:"Removed Like from post"
        })
}

const commentPost=async(req,res)=>{
        const {postid,comment}=req.body;
        const postComment=await commentPostService(postid,comment,req.accessToken.userid)
        successResponse(res,{
            message:"Commented post",
            data:{
                comment:postComment
            }
        })
}

const FollowCreator=async(req,res)=>{
        const CreatorFollow= await FollowCreatorService(req.params.id,req.accessToken.userid);
        successResponse(res,{
            message:"following creator",
            data:{
                isFollow:CreatorFollow
            } 
        })
    
}

const unFollowCreator=async(req,res)=>{
        await unFollowCreatorService(req.params.id,req.accessToken.userid);
        successResponse(res,{
            message:"Unfollowed the creator"
        })
}

const FollowPostCreator=async(req,res)=>{
        const CreatorFollow= await FollowPostCreatorService(req.params.id,req.accessToken.userid);
        successResponse(res,{
            message:"following creator",
            data:{
                isFollow:CreatorFollow
            } 
        })
    
}

const unFollowPostCreator=async(req,res)=>{
        await unFollowPostCreatorService(req.params.id,req.accessToken.userid);
        successResponse(res,{
            message:"Unfollowed the creator"
        })
}


const bookmarkPost=async(req,res)=>{
        const PostBookMark= await bookmarkPostService(req.params.id,req.accessToken.userid);
        successResponse(res,{
            message:"bookmarked post",
            data:{
                isBookmark:PostBookMark
            }
        })
}

const removebookmarkPost=async(req,res)=>{
        const PostRemoveBookmark= await removeBookmarkPostService(req.params.id,req.accessToken.userid);
        successResponse(res,{
            message:"Removed Bookmark from post"
        })

}


//get data

const getComments=async(req,res)=>{
        const comments= await getCommentsService(req.params.id);
        successResponse(res,{
            message:"Retrieved all post comments",
            data:{
                comments,
                count:comments.length
            }
        })
}

const getLikes=async(req,res)=>{
        const likes= await getLikesService(req.params.id);
        successResponse(res,{
            message:"Retrieved all post likes ",
            data:{
                likes,
                coute:likes.length
            }
        })
}
const getBookmarks=async(req,res)=>{
        const bookmarks= await getBookmarksService(req.params.id);
        successResponse(res,{
            message:"Retrieved all post bookmarks ",
            data:{
                bookmarks,
                coute:bookmarks.length
            }
        })
}

const getIsLiked=async(req,res)=>{
        const data=await getIsLikedService(req.params.id,req.accessToken.userid)
        successResponse(res,data)
}

const getIsFollow=async(req,res)=>{
        const data=await getIsFollowService(req.params.id,req.accessToken.userid)
        //console.log(data);
        successResponse(res,data)
}
const getPostIsFollow=async(req,res)=>{
        const data=await getPostIsFollowService(req.params.id,req.accessToken.userid)
        //console.log(data);
        successResponse(res,data)
}

const getIsBookmark=async(req,res)=>{
        const data=await getIsBookmarkService(req.params.id,req.accessToken.userid)
        successResponse(res,data)
}

const getCreatorPosts=async(req,res)=>{
        const Posts= await getCreatorPostsService(req.params.id);
        successResponse(res,{
                message:"Retrieved all posts of creator",
                data:{
                    posts:Posts,
                    count:Posts.length
                }
        })
}

//get all creators data
const getCreators=async(req,res)=>{
        const Creator=await getCreatorsService();
        successResponse(res,{
            message:"successsfully retrived creators data.",
            data:{
                creator:Creators
            }
        })
}

const getCreator=async(req,res)=>{
        const Creator=await getCreatorService(req.params.id);
        successResponse(res,{
            message:"successfully retrived creator data.",
            data:{
                creator:Creator
            }
        })
}

const getCreatorfollowers=async(req,res)=>{
       const data=await getCreatorfollowersService(req.params.id)
        successResponse(res,data)
}

const getCreatorfollowing=async(req,res)=>{
        const data=await getCreatorfollowersService(req.params.id)
        successResponse(res,data)
    
}

const getUserfollowing=async(req,res)=>{
        const data=await getUserfollowingService(req.accessToken.userid);
        successResponse(res,data)

}
const getUserfollowingAccounts=async(req,res)=>{
        const data=await getUserfollowingAccountsService(req.accessToken.userid);
        successResponse(res,data)

}
const getAllCreators=async(req,res)=>{
        const data=await getCreatorsService();
        successResponse(res,{data})

}


module.exports={
                welcome,
                getPost,
                getPosts,
                viewPost,

                getSimilarPosts,

                getBookmarkedPosts,
                likePost,
                disLikePost,
                commentPost,
                FollowCreator,
                unFollowCreator,
                FollowPostCreator,
                unFollowPostCreator,
                bookmarkPost,
                removebookmarkPost,

                getComments,
                getLikes,
                getBookmarks,
                getIsLiked,
                getIsFollow,
                getPostIsFollow,
                getIsBookmark,
                getCreatorPosts,
                getCreator,
                getCreatorfollowers,
                getCreatorfollowing,
                getUserfollowing,
                getUserfollowingAccounts,
                getAllCreators
            }