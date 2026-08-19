const BirdPost = require("../model/BirdPost");
const PhotographerProfile = require("../model/PhotographerProfile");
const Like=require("../model/LikePost");
const Comment=require("../model/CommentPost");
const Follow=require("../model/FollowCreator")
const BookMark=require("../model/BookMark");
const User = require("../model/User");
const mongoose=require("mongoose");
const logger = require("../utils/logger");
const { updateById, userById } = require("../repository/user_repository");
const successResponse = require("./successResponse");
const deleteUser = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const userId = req.accessToken.userid;
        const user = await User.findById(userId).session(session);

        if (!user) {
            throw new Error("User not found");
        }

        const role = user.role;
        

        await Promise.all([
            BookMark.deleteMany(
                { user: userId },
                { session }
            ),

            Like.deleteMany(
                { user: userId },
                { session }
            ),

            Comment.deleteMany(
                { user: userId },
                { session }
            ),

            Follow.deleteMany(
                { user: userId },
                { session }
            )
        ]);

        if (role === "creator") {

            const creator = await PhotographerProfile
                .findOne({ user: userId })
                .session(session);

            if (!creator) {
                throw new Error("Creator profile not found");
            }

            const creatorId = creator._id;

            // beforePosts = await BirdPost.countDocuments({
            //     creator: creatorId
            // });

            const posts = await BirdPost.find({
                creator: creatorId
            })
                .select("_id")
                .lean()
                .session(session);

            const postIds = posts.map(post => post._id);

            if (postIds.length > 0) {

                await Promise.all([

                    BookMark.deleteMany(
                        {
                            post: {
                                $in: postIds
                            }
                        },
                        { session }
                    ),

                    Like.deleteMany(
                        {
                            post: {
                                $in: postIds
                            }
                        },
                        { session }
                    ),

                    Comment.deleteMany(
                        {
                            post: {
                                $in: postIds
                            }
                        },
                        { session }
                    )

                ]);

                await BirdPost.deleteMany(
                    {
                        creator: creatorId
                    },
                    {
                        session
                    }
                );
            }

            await Follow.deleteMany(
                {
                    creator: creatorId
                },
                {
                    session
                }
            );

            await PhotographerProfile.deleteOne(
                {
                    _id: creatorId
                },
                {
                    session
                }
            );
        }

        await User.deleteOne(
            {
                _id: userId
            },
            {
                session
            }
        );

        await session.commitTransaction();
        

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully."
        });

    } catch (err) {

        await session.abortTransaction();

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    } finally {

        await session.endSession();

    }
};

const updateUser = async (req, res) => {
    const updatedData=req.body;
    const userId = req.accessToken.userid;
    const updatedUser = await updateById(userId, updatedData);
    successResponse(res,{
            message:`Successfully retrived user details.`,
            data:{
                username:updatedUser.username,
                email:updatedUser.email
            }
        })
};

const getUser = async (req, res) => {
    const userId = req.accessToken.userid;
    const userData = await userById(userId);

    successResponse(res,{
            message:`Successfully retrived user details.`,
            data:{
                username:userData.username,
                email:userData.email,
                role:userData.role
            }
        })
};
module.exports={
    deleteUser,
    updateUser,
    getUser
}