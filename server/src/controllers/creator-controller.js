
const PhotographerProfile = require("../model/PhotographerProfile");
const User = require("../model/User");
const { uploadToCloudinary } =
    require("../services/cloudinaryService");

const { default: mongoose } = require("mongoose");
const {
    creatorRegisterService,
    getCreatorService,
    updateCreatorService,
    uploadPostService,
    getPostService,
    getSinglePostService,
    updatePostService,
    deletePostService
} = require("../services/creatorService")
const asyncHandler=require("./asyncHandler");
const successResponse=require("./successResponse")

const config = require("../config/config");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
    }=require("../errors/AppError");
//for deployment
const register = async (req, res) => {

    const profileImage =
        req.files?.profileImage?.[0];

    const coverImage =
        req.files?.coverImage?.[0];

    const cameraImage =
        req.files?.cameraImage?.[0];


    const creatorData = {
        ...req.body,

        profileImage: profileImage
            ? (
                await uploadToCloudinary(
                    profileImage.buffer,
                    "brd/creators/profile"
                )
            ).secure_url
            : "",

        coverImage: coverImage
            ? (
                await uploadToCloudinary(
                    coverImage.buffer,
                    "brd/creators/cover"
                )
            ).secure_url
            : "",

        cameraImage: cameraImage
            ? (
                await uploadToCloudinary(
                    cameraImage.buffer,
                    "brd/creators/camera"
                )
            ).secure_url
            : ""
    };


    const creator = await creatorRegisterService(
        creatorData,
        req.accessToken.userid
    );

    const updatedUser = await User.findById(
        req.accessToken.userid
    );

    const accessToken = jwt.sign(
        {
            userid: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role
        },
        config.jwt.secret
    );


    return successResponse(res, {
        statusCode: 201,
        message: "Successfully upgraded to creator.",
        data: {
            creator,
            token: accessToken
        }
    });

};
const getCreator= async(req,res)=>{
        const creatorDetails =  await getCreatorService(req.accessToken.userid);
        successResponse(res,{
                    message:`successfully retrived creator details.`,
                    data:{
                        creator:creatorDetails
                    }
        })
}
const updateCreator = async (req, res) => {

    const updateData = {
        ...req.body
    };


    // Profile image
    if (req.files?.profileImage?.[0]) {

        const result =
            await uploadToCloudinary(
                req.files.profileImage[0].buffer,
                "brd/creators/profile"
            );

        updateData.profileImage =
            result.secure_url;
    }


    // Cover image
    if (req.files?.coverImage?.[0]) {

        const result =
            await uploadToCloudinary(
                req.files.coverImage[0].buffer,
                "brd/creators/cover"
            );

        updateData.coverImage =
            result.secure_url;
    }


    // Camera image
    if (req.files?.cameraImage?.[0]) {

        const result =
            await uploadToCloudinary(
                req.files.cameraImage[0].buffer,
                "brd/creators/camera"
            );

        updateData.cameraImage =
            result.secure_url;
    }


    // FormData sends this as a string
    if (typeof updateData.specialization === "string") {

        try {

            updateData.specialization =
                JSON.parse(updateData.specialization);

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: "Invalid specialization format."
            });

        }
    }


    const updatedCreator =
        await updateCreatorService(
            req.accessToken.userid,
            updateData
        );


    successResponse(res, {
        message: "Successfully updated creator.",
        data: {
            creator: updatedCreator
        }
    });
};

const uploadPost = async (req, res) => {

    let images = [];

    if (req.file) {

        const result =
            await uploadToCloudinary(
                req.file.buffer,
                "brd/birds"
            );

        images = [
            result.secure_url
        ];
    }


    const postData = {
        ...req.body,
        images
    };


    const newPost =
        await uploadPostService(
            postData,
            req.accessToken.userid
        );


    successResponse(res, {

        message:
            "Bird post uploaded successfully.",

        data: {

            post: newPost

        }

    });
};

const getPost= async(req,res)=>{
        const Posts = await getPostService(req.accessToken.userid);
        successResponse(res,{
                    message:`successfully retrived posts`,
                    data:{
                        posts:Posts
                    }
        })
}

const getSinglePost= async(req,res)=>{
        const post = await getSinglePostService(req.params.id,req.accessToken.userid);
        successResponse(res,{
                    message:`successfully retrived post`,
                    data:{
                        post:post
                    }
        })
}

const updatePost= async(req,res)=>{
        const updatePostData=req.body;
        const updatedPost =  await updatePostService(req.params.id,req.accessToken.userid,updatePostData);
        successResponse(res,{
                    message:`successfully updated post`,
                    data:{
                        post:updatedPost
                    }
        })
        

}

const deletePost= async(req,res)=>{
        const deletedPost =  await deletePostService(req.params.id,req.accessToken.userid);
        successResponse(res,{
                    message:`successfully deleted post`,
                    data:{
                        post:deletedPost
                    }
        })

}

module.exports={
    register,
    getCreator,
    updateCreator,
    uploadPost,
    getPost,
    getSinglePost,
    updatePost,
    deletePost
}

