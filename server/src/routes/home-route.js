const express=require("express");
const auth_middleware=require("../middleware/auth_middleware");
const { welcome,
        getPosts,
        viewPost,
        getBookmarkedPosts,
        getPost,
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
        getAllCreators,
        getSimilarPosts
        }=require("../controllers/home-controller");
const { getPersonalizedMenu } = require("../modules/recommendation/controller/personalized-menu.controller");
const route=express.Router();

route.get('/welcome',auth_middleware,welcome)
route.get('/:id/post',auth_middleware,getPost)

//route.get('/post/:id/similar',auth_middleware,getSimilarPosts);
route.get('/post/:id/similar',auth_middleware,getSimilarPosts);
route.get('/posts',auth_middleware,getPosts)

route.post('/post/:id/view',auth_middleware,viewPost);



route.get('/menu',auth_middleware,getPersonalizedMenu);

route.get('/bookmark-posts',auth_middleware,getBookmarkedPosts)
route.get('/:id/post-like',auth_middleware,likePost)
route.delete('/:id/post-dislike',auth_middleware,disLikePost)
route.post('/post-comment',auth_middleware,commentPost)
route.get('/:id/creator-follow',auth_middleware,FollowCreator)
route.delete('/:id/creator-unfollow',auth_middleware,unFollowCreator)

route.get('/:id/creator-post-follow',auth_middleware,FollowPostCreator)
route.delete('/:id/creator-post-unfollow',auth_middleware,unFollowPostCreator)

route.get('/:id/post-bookmark',auth_middleware,bookmarkPost)
route.delete('/:id/post-remove-bookmark',auth_middleware,removebookmarkPost)

route.get('/post/:id/comments',auth_middleware,getComments)
route.get('/post/:id/likes',auth_middleware,getLikes)
route.get('/post/:id/bookmarks',auth_middleware,getBookmarks)
route.get('/post/:id/is-like',auth_middleware,getIsLiked) 
route.get('/user/:id/follow',auth_middleware,getIsFollow)
route.get('/user/post/:id/follow',auth_middleware,getPostIsFollow)
route.get('/post/:id/is-bookmark',auth_middleware,getIsBookmark)
route.get('/user/following',auth_middleware,getUserfollowing)
route.get('/user/following-accounts',auth_middleware,getUserfollowingAccounts)
route.get('/creator/:id/posts',auth_middleware,getCreatorPosts)
route.get('/creator/:id/info',auth_middleware,getCreator)
route.get('/creator/:id/followers',auth_middleware,getCreatorfollowers)
route.get('/creator/:id/following',auth_middleware,getCreatorfollowing)

route.get('/creators',auth_middleware,getAllCreators)




module.exports=route;