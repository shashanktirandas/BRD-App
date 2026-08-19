const BirdPost = require("../model/BirdPost")
const FollowCreator = require("../model/FollowCreator")
const LikePost = require("../model/LikePost")


const TopBirdPosted=async(req,res)=>{
    try{
        const TopBirds=await BirdPost.aggregate([
            {
                $group:{
                    _id:"$birdName",
                    count:{
                        $sum:1
                    }
                }
            },
            {
                $sort:{
                    count:-1
                }
            }
        ])
        res.status(200).json({
            success:true,
            message:"We retrived top birds list",
            data:TopBirds,
            count:TopBirds.length
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:"error occur in analytics controller"
        })
    }
}
const TopLikedBirdPosted=async(req,res)=>{
    try{
        const TopFollowed=await LikePost.aggregate([
            {
                $group:{
                    _id:"$post",
                    count:{
                        $sum:1
                    }
                }
            },
            {
                $sort:{
                    count:-1
                }
            },
            {
                $lookup:{
                    from: "birdposts",
                    localField:"_id",
                    foreignField: "_id",
                    as: "postInfo"
                }
            },
            {
                $unwind:"$postInfo"
            },
            {
                $project:{
                    birdName:"$postInfo.birdName",
                    images:"$postInfo.images",
                    likes:"$count"
                }
            }
        ])
        res.status(200).json({
            success:true,
            message:"We retrived top followers",
            data:TopFollowed,
            count:TopFollowed.length
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:"error occur in analytics controller"
        })
    }
}
const TopFollowedCreator=async(req,res)=>{
    try{
        const TopFollowed=await FollowCreator.aggregate([
            {
                $group:{
                    _id:"$creator",
                    count:{
                        $sum:1
                    }
                }
            },
            {
                $sort:{
                    count:-1
                }
            },
            {
                $lookup:{
                    from: "photographerprofiles",
                    localField:"_id",
                    foreignField: "_id",
                    as: "creatorInfo"
                }
            },
            {
                $unwind:"$creatorInfo"
            },
            {
                $project:{
                    displayName:"$creatorInfo.displayName",
                    profileImage:"$creatorInfo.profileImage",
                    followers:"$count"
                }
            }
        ])
        res.status(200).json({
            success:true,
            message:"We retrived top followers",
            data:TopFollowed,
            count:TopFollowed.length
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:"error occur in analytics controller"
        })
    }
}
module.exports={
    TopBirdPosted,
    TopLikedBirdPosted,
    TopFollowedCreator
}