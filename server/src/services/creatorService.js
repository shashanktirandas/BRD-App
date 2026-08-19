
const BirdPost = require("../model/BirdPost");
const PhotographerProfile = require("../model/PhotographerProfile");
const User = require("../model/User");
const {
    findUserById,
    findCreatorByUserId,
    updateCreatorById,
    findCreators,
    createBirdPost,
    updatePostByCreator,
    deletePostByCreator,
    findUserByIdWithSession,
    findCreatorByUserWithSession,
    createPhotographerWithSession,
    updateUserRoleWithSession
}=require("../repository/creator_repository")
const {
    existingUser
}=require("../repository/user_repository");
const {
    findPostsByCreatorid,
    findPostById
}=require("../repository/post_repository")
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    ValidationError
}=require("../errors/AppError")
const { default: mongoose } = require("mongoose");
const logger = require("../utils/logger");
const creatorRegisterService=async(data,user)=>{
     const session = await mongoose.startSession();
    try{
        let newPhotographer;
        await session.withTransaction(async()=>{
            const existingUser = await findUserByIdWithSession(user, session);
            if(!existingUser){
                throw new NotFoundError("User not found.");
            }
            if(existingUser.role === "creator"){
                throw new BadRequestError("User is already a creator.");
            }
            const existingCreator = await findCreatorByUserWithSession(user, session);
            if(existingCreator){
                throw new ConflictError("Creator already registered.");
            }
            newPhotographer = await createPhotographerWithSession(user,data,session)
            await updateUserRoleWithSession(user,session)
        })
        return newPhotographer[0];
        
    }finally{
        await session.endSession();
    }
}

const getCreatorsService= async()=>{
        const creatorDetails =  await findCreators();
        if(!creatorDetails){
            throw new NotFoundError("creator not found!");
        }
        return creatorDetails;
}
const getCreatorService= async(userid)=>{
        const creatorDetails =  await findCreatorByUserId(userid);
        if(!creatorDetails){
            throw new NotFoundError("creator not found!");
        }
        return creatorDetails;
}

const updateCreatorService= async(userid,updateCreatorData)=>{
        const creator = await findCreatorByUserId(userid);
        //console.log(creator);
        const updatedCreator =  await updateCreatorById(creator._id,updateCreatorData);
        
        if(!updatedCreator){
            throw new NotFoundError("creator not found!");
        }
        return updatedCreator;
}

const uploadPostService = async (postData, userid) => {
        const {
            birdName,
            scientificName,
            images,
            description,
            country,
            state,
            city,
            capturedAt,
            cameraBrand,
            cameraModel,
            lens,
            tags
        } = postData;

        // Check User
        const user = await existingUser(userid);
        if (!user) {
            throw new NotFoundError("User not found.");
        }

        // Check Creator Profile
        const creator = await findCreatorByUserId(userid);
        if (!creator) {
            throw new NotFoundError("Only creators can upload bird posts.");
        }

        // Create Bird Post
        return await createBirdPost({

            creator: creator._id,

            birdName: birdName,
            scientificName: scientificName,

            images: images,

            description: description,

            country: country,
            state: state,
            city: city,

            capturedAt: capturedAt,

            cameraBrand: cameraBrand,
            cameraModel: cameraModel,
            lens: lens,

            tags: tags

        });
};

const getPostService= async(userid)=>{
        const creator = await findCreatorByUserId(userid);
        const Posts = await findPostsByCreatorid(creator._id);
        if(!Posts){
            throw new NotFoundError("no posts are yet uploaded!");
        }
       return Posts;
}
const getSinglePostService= async(postid,userid)=>{
        const creator = await findCreatorByUserId(userid);
        const post = await findPostById(postid);
        if (!post) {
            throw new NotFoundError("Post not found.");
        }
        if (post.creator.toString() !== creator._id.toString()) {
            throw new UnauthorizedError("You are not allowed to see this post.");
        }
        return post;
}

const updatePostService= async(postid,userid,updatePostData)=>{
        
        const creator = await await findCreatorByUserId(userid);
        const post = await findPostById(postid);
        if (!post) {
            throw new NotFoundError("Post not found.");
        }
        if (post.creator.toString() !== creator._id.toString()) {
            throw new UnauthorizedError("You are not allowed to update this post.");
        }
        const updatedPost =  await updatePostByCreator(postid,updatePostData);
        if(!updatedPost){
            throw new NotFoundError("Updated Post not found.");
        }
        return updatedPost;
}

const deletePostService= async(postid,userid)=>{
        const creator = await await findCreatorByUserId(userid);
        const post = await findPostById(postid);
        if (!post) {
            throw new NotFoundError("Post not found.");
        }
        if (post.creator.toString() !== creator._id.toString()) {
            logger.info({
                event:"chechkinnng",
                a:post.creator.toString(),
                b:creator._id.toString()
            })
            throw new UnauthorizedError("You are not allowed to delete this post.");
        }
        return await deletePostByCreator(postid);

}

module.exports={
    creatorRegisterService,
    getCreatorsService,
    getCreatorService,
    updateCreatorService,
    uploadPostService,
    getPostService,
    getSinglePostService,
    updatePostService,
    deletePostService
}