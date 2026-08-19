const postQueryBuilder=require("./postQueryBuilder");
const creatorQueryBuilder=require("./creatorQueryBuilder");
const BirdPost = require("../model/BirdPost");
const PhotographerProfile = require("../model/PhotographerProfile");
const buildQuery=async (query)=>{
    const postQuery = postQueryBuilder(query);
    const creatorQuery = await creatorQueryBuilder(query);

    const [posts,creators]=await Promise.all([
        BirdPost.find(postQuery.finalQuery)
            .populate({
                path: "creator",
                select: "displayName profileImage",
                populate: {
                    path: "user",
                    select: "username"
                }
            }).sort(postQuery.sortOption)
            .skip(postQuery.skip)
            .limit(postQuery.limit),
            PhotographerProfile.find(creatorQuery.finalQuery)
                .sort(creatorQuery.sortOption)
                .limit(creatorQuery.limit)
                .skip(creatorQuery.skip)
    ])
    return {
        posts,creators
    }
}

module.exports=buildQuery;