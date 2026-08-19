const BirdPost=require("../model/BirdPost");
const PhotographerProfile = require("../model/PhotographerProfile");
const postQueryBuilder=require("../utils/postQueryBuilder");
const creatorQueryBuilder=require("../utils/creatorQueryBuilder");
const finalQueryBuilder=require("../utils/searchService");
const {
    searchBirdNameService,
    searchCreatorsService,
    searchAllService
}=require("../services/searchService")
const successResponse=require("../controllers/successResponse")

const {
    getSuggestions
} = require("../search/suggestion/suggestionEngine");
const searchEngine = require("../search/searchEngine");

const searchBirdName=async(req,res)=>{
    const data=await searchBirdNameService(req.query);
    successResponse(res,data);
}

const searchCreators=async(req,res)=>{
    const data=await searchCreatorsService(req.query);
    successResponse(res,data);
}

const searchAll=async(req,res)=>{
    const data=await searchAllService(req.query);
    successResponse(res,data);
}

 const filterAll=async(req,res)=>{
//     try{
//         const {
//                 country,
//                 state,
//                 city,
//                 cameraBrand,
//                 cameraModel,
//                 birdName
//             } = req.query;
//         const filter = {};
//         if (country) {
//             filter.country = {
//                                 $regex: country,
//                                 $options: "i"
//                             };
//         }

//         if (state) {
//             filter.state = {
//                                 $regex: state,
//                                 $options: "i"
//                             };
//         }

//         if (city) {
//             filter.city = {
//                                 $regex: city,
//                                 $options: "i"
//                             };
//         }

//         if (cameraBrand) {
//             filter.cameraBrand = {
//                                 $regex: cameraBrand,
//                                 $options: "i"
//                             };
//         }

//         if (cameraModel) {
//             filter.cameraModel = {
//                                 $regex: cameraModel,
//                                 $options: "i"
//                             };
//         }

//         if (birdName) {
//             filter.birdName = {
//                                 $regex: birdName,
//                                 $options: "i"
//                             };
//         }
        
//         const page=Number(req.query.page)||1;
//         const sort=req.query.sort||"newest";
//         let sortOption={createdAt:-1};
//         if(sort==="oldest"){
//             sortOption={createdAt:1};
//         }
//         const limit=10;
//         const skip = (page - 1) * limit;

        
//         const [posts, creators] = await Promise.all([
//                 BirdPost.find(filter).populate({
//                             path: "creator",
//                             select: "displayName profileImage",
//                             populate: {
//                                 path: "user",
//                                 select: "username"
//                             }
//                         }).sort(sortOption)
//                 .skip(skip)
//                 .limit(limit),
//                 PhotographerProfile.find(filter)
//                 .sort(sortOption)
//                 .skip(skip)
//                 .limit(limit)
//             ]);

//         if (creators.length === 0 && posts.length===0) {
//             return res.status(200).json({
//                 success: true,
//                 message: "No matching creator and post found.",
//                 query:filter,
//                 postCount:posts.length,
//                 creatorCount:creators.length,
//                 posts:posts,
//                 creators:creators
//         });
//     }
//         return res.status(200).json({
//                 success:true,
//                 message:"successfully retrived search results",
//                 query:filter,
//                 postCount:posts.length,
//                 creatorCount:creators.length,
//                 posts:posts,
//                 creators:creators
//             });

//     }catch(err){
//         res.status(500).json({
//             success:false,
//             message:"error occur at serach posts with tags"
//         })
//     }
 }

const searchSuggestions = async (req, res) => {

    try {

        const {
            q
        } = req.query;


        const suggestions =
            await getSuggestions(q);


        const data = {

            message:
                "Search suggestions retrieved successfully.",

            data: {

                query:
                    q || "",

                suggestions:
                    suggestions
            }
        };


        successResponse(
            res,
            data
        );

    } catch (error) {

        console.error(
            "SEARCH SUGGESTIONS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to load search suggestions"

        });
    }
};

const searchEngineSearch = async (req, res) => {

    try {

        console.log("");
        console.log("======================================");
        console.log("SEARCH ENGINE ROUTE HIT");
        console.log("QUERY:", req.query);
        console.log("======================================");

        const {
            q,
            page = 1,
            limit = 20,
            type = "all"
        } = req.query;

        console.log("BEFORE SEARCH ENGINE");

        const data = await searchEngine({
            query: q,
            page: Number(page),
            limit: Number(limit),
            type,
            userId: null
        });

        console.log("AFTER SEARCH ENGINE");

        return res.status(200).json({
            success: true,
            message: "Search completed successfully.",
            data,
            meta: null
        });

    } catch (error) {

        console.error("");
        console.error("SEARCH ENGINE ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Search failed.",
            error: error.message
        });

    }
};

module.exports = {

    searchBirdName,

    searchCreators,

    searchAll,

    filterAll,

    searchSuggestions,

    searchEngineSearch
};