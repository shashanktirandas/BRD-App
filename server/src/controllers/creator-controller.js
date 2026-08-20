
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

const config=require("../config/config");
const logger=require("../utils/logger");
const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
    }=require("../errors/AppError");
const register_m=async(req,res)=>{
     const session = await mongoose.startSession();
    try{
        const {
                // user,
                displayName,
                
                profileImage,
                coverImage,
                bio,
                country,
                state,
                city,
                experience,
                cameraBrand,
                cameraModel,
                mainLens,
                instagram,
                website,
                youtube,
                specialization,
                //isVerified
            } = req.body;
        
        //check is userid exist
        //console.log(req.accessToken);
        const user=req.accessToken.userid;
        const  existingUser=await User.findById(user);
        if(!existingUser){
            return res.status(401).json({
                success:false,
                message:"username didnt exist!, try with another userid.",
                field:"user"
            })
        }
        if(existingUser.role === "creator"){
            return res.status(400).json({
                success:false,
                message:"User is already a creator."
            });
        }
        const alreadyCreator = await PhotographerProfile.findOne({ user });
        if (alreadyCreator) {
            return res.status(400).json({
                success: false,
                message: "User is already a creator."
            });
        }

       
        const newPhotographer = await PhotographerProfile.create([{
            user: user,
            displayName: displayName,
            profileImage: profileImage,
            coverImage: coverImage,
            bio: bio,
            country: country,
            state: state,
            city: city,
            experience: experience,
            cameraBrand: cameraBrand,
            cameraModel: cameraModel,
            mainLens: mainLens,
            instagram: instagram,
            website: website,
            youtube: youtube,
            specialization: specialization
        }],{
            session
        });
        if(!newPhotographer){
            return res.status(401).json({
                success:false,
                message:"something went wrong in mongooes at creator register."
            })
        }
        const upgradedUser=await User.findByIdAndUpdate(user,
                {
                    role: "creator"
                },
                {
                    returnDocument: "after",
                    session
                }
            
            );
        await session.commitTransaction();
        
        return res.status(201).json({
            success: true,
            message: "Successfully upgraded to creator.",
            data: newPhotographer[0]
        });
    }catch(err){
        await session.abortTransaction();
        console.log(err)
        res.status(501).json({
            success:false,
            message:"error occur in signup logic"
        })
        
        
    } finally{
        await session.endSession();
    }
}
const register_u=async(req,res)=>{
     const session = await mongoose.startSession();
    try{
        const {
                // user,
                displayName,
                
                profileImage,
                coverImage,
                bio,
                country,
                state,
                city,
                experience,
                cameraBrand,
                cameraModel,
                mainLens,
                instagram,
                website,
                youtube,
                specialization,
                //isVerified
            } = req.body;
        
        //check is userid exist
        //console.log(req.accessToken);
        const user=req.accessToken.userid;
        const  existingUser=await User.findById(user);
        if(!existingUser){
            return res.status(401).json({
                success:false,
                message:"username didnt exist!, try with another userid.",
                field:"user"
            })
        }
        if(existingUser.role === "creator"){
            return res.status(400).json({
                success:false,
                message:"User is already a creator."
            });
        }
        const alreadyCreator = await PhotographerProfile.findOne({ user });
        if (alreadyCreator) {
            return res.status(400).json({
                success: false,
                message: "User is already a creator."
            });
        }

        let newPhotographer;
        await session.withTransaction(async()=>{

        
         newPhotographer = await PhotographerProfile.create([{
            user,
            displayName,
            profileImage,
            coverImage,
            bio,
            country,
            state,
            city,
            experience,
            cameraBrand,
            cameraModel,
            mainLens,
            instagram,
            website,
            youtube,
            specialization
        }],{
            session
        });
        
        const upgradedUser=await User.findByIdAndUpdate(user,
                {
                    role: "creator"
                },
                {
                    returnDocument: "after",
                    session
                }
            
            );
        
        })
        return res.status(201).json({
            success: true,
            message: "Successfully upgraded to creator.",
            data: newPhotographer[0]
        });
        
    }catch(err){
        
        console.log(err)
        res.status(501).json({
            success:false,
            message:"error occur in signup logic"
        })
        
        
    } finally{
        await session.endSession();
    }
}
const register_a=asyncHandler(
    async(req,res)=>{
        const creator=await creatorRegisterService(
        req.body,
        req.accessToken.userid
     )
    //  return res.status(201).json({
    //         success: true,
    //         message: "Successfully upgraded to creator.",
    //         data: creator
    //     });
    return successResponse(res,{
        statusCode:201,
        message:"Successfully upgraded to creator.",
        data:creator
    })

});

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


    return successResponse(res, {
        statusCode: 201,
        message: "Successfully upgraded to creator.",
        data: creator
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

