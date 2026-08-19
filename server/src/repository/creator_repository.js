const BirdPost = require("../model/BirdPost");
const PhotographerProfile = require("../model/PhotographerProfile");
const Like=require("../model/LikePost");
const Comment=require("../model/CommentPost");
const Follow=require("../model/FollowCreator")
const BookMark=require("../model/BookMark");
const User = require("../model/User");

const  findUserByIdWithSession=async(user,session)=>{
    return await User.findById(user).session(session);
}
const findCreatorByIdWithSession=async(creatorid,session)=>{
    return await PhotographerProfile.findById(creatorid).session(session);
}

const  findCreatorByUserWithSession=async(user,session)=>{
    return await PhotographerProfile.findOne({ user }).session(session);
}

const  createPhotographerWithSession=async(user,data,session)=>{
    const {
        displayName,
        profileImage,
        coverImage,
        cameraImage,
        bio,
        country,
        state,
        city,
        experience,
        cameraBrand,
        cameraModel,
        mainLens,
        zoomLens,
        instagram,
        website,
        youtube,
        specialization
    } = data;
    return await PhotographerProfile.create([{
        user,
        displayName,
        profileImage,
        coverImage,
        cameraImage,
        bio,
        country,
        state,
        city,
        experience,
        cameraBrand,
        cameraModel,
        mainLens,
        zoomLens,
        instagram,
        website,
        youtube,
        specialization
    }], {
        session
    });
}

const  updateUserRoleWithSession=async(user,session)=>{
    return await User.findByIdAndUpdate(user,
                {
                    role: "creator"
                },
                {
                    new: true,
                    session
                }
            
            );
}


const  findUserById=async(user)=>{
    return await User.findById(user);
}
  

// const  updateCreatorById=async(creatorId,data)=>{
//     return await PhotographerProfile.findByIdAndUpdate(creatorId,data);
// } 

const updateCreatorById = async (creatorId, data) => {

    return await PhotographerProfile.findByIdAndUpdate(
        creatorId,
        {
            $set: data
        },
        {
            new: true,
            runValidators: true
        }
    );

};

const findCreators = async () => {
    return PhotographerProfile.find({ isVerified:false });
}
const  findCreatorByUserId=async(user)=>{
    return await PhotographerProfile.findOne({ user })
}
const  createBirdPost=async(data)=>{
    return await BirdPost.create(data);
}
const updatePostByCreator=async(postid,data)=>{
    return await BirdPost.findByIdAndUpdate(postid,data);
}
const deletePostByCreator=async(postid)=>{
    return await BirdPost.findByIdAndDelete(postid);
}
module.exports={
    findUserById,
    updateCreatorById,
    findCreators,
    findCreatorByUserId,
    createBirdPost,
    updatePostByCreator,
    deletePostByCreator,
    findUserByIdWithSession,
    findCreatorByIdWithSession,
    findCreatorByUserWithSession,
    createPhotographerWithSession,
    updateUserRoleWithSession
}
