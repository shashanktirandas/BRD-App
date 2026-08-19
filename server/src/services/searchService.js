const BirdPost = require("../model/BirdPost");
const postQueryBuilder=require("../utils/postQueryBuilder");
const creatorQueryBuilder=require("../utils/creatorQueryBuilder");
const finalQueryBuilder=require("../utils/searchService")
const PhotographerProfile = require("../model/PhotographerProfile");
const searchBirdNameService=async(query)=>{
    const postQuery=postQueryBuilder(query);
    const posts=await BirdPost.find(postQuery.finalQuery)
                    .sort(postQuery.sortOption)
                    .skip(postQuery.skip)
                    .limit(postQuery.limit)
                    .populate({
                        path: "creator",
                        select: "displayName profileImage",
                        populate: {
                            path: "user",
                            select: "username"
                        }
                    });
    if (posts.length === 0) {
        return {
                message: "No matching birds found.",
                data:{
                    posts:[]
                }
        }
    }else{
        return {
                message: "Birds found successfully.",
                data:{
                    count: posts.length,
                    posts: posts
                }
        }
    }
}

const searchCreatorsService=async(query)=>{
    const creatorQuery=await creatorQueryBuilder(query)
    const creators=await PhotographerProfile.find(creatorQuery.finalQuery)
                    .sort(creatorQuery.sortOption)
                    .skip(creatorQuery.skip)
                    .limit(creatorQuery.limit)
                    .populate({
                        path: "user",
                        select: "username"
                    })
    if (creators.length === 0) {
        return {
                message: "No matching creator found.",
                data:{
                    creators:[]
                }
        }
    }else{
        return {
                message: "creators found successfully.",
                data:{
                    count: creators.length,
                    creators: creators
                }
        }
    }
}

const searchAllService=async(query)=>{
    const {posts, creators} = await finalQueryBuilder(query);
    if (creators.length === 0 && posts.length===0) {
            return {
                message: "No matching creator and post found.",
                data:{
                    query:query.q,
                    postCount:posts.length,
                    creatorCount:creators.length,
                    posts:[],
                    creators:[]
                }
            }
    }else{
            return {
                message: "successfully retrived search results",
                data:{
                    query:query.q,
                    postCount:posts.length,
                    creatorCount:creators.length,
                    posts:posts,
                    creators:creators
                }
            }
    }
}

module.exports={
    searchBirdNameService,
    searchCreatorsService,
    searchAllService
}