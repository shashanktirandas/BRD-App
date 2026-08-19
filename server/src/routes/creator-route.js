const express=require("express");
const auth_middleware=require("../middleware/auth_middleware");
const creator_middleware=require("../middleware/creator_middleware");
const {register,getCreator,updateCreator,uploadPost,getPost,getSinglePost,updatePost,deletePost}=require("../controllers/creator-controller")
const {
    registerCreatorSchema
}=require("../validators/creator.validator")
const validate=require("../middleware/validate_middleware")
const upload =
    require("../middleware/upload-middleware");
const creatorUpload =
    require("../middleware/creator-upload-middleware");

const route=express.Router();
//route.post("/register",auth_middleware,validate(registerCreatorSchema),register);

const parseCreatorFormData = (req, res, next) => {

    if (typeof req.body.specialization === "string") {

        try {

            req.body.specialization =
                JSON.parse(req.body.specialization);

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: "Invalid specialization format."
            });

        }
    }

    next();
};

route.post(
    "/register",
    auth_middleware,

    creatorUpload.fields([
        {
            name: "profileImage",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        },
        {
            name: "cameraImage",
            maxCount: 1
        }
    ]),

    parseCreatorFormData,

    validate(registerCreatorSchema),

    register
);
route.get("/get",auth_middleware,creator_middleware,getCreator);
route.post("/upload",auth_middleware,creator_middleware,upload.single("image"),uploadPost);
route.put(
    "/update",
    auth_middleware,
    creator_middleware,
    upload.fields([
        {
            name: "profileImage",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        },
        {
            name: "cameraImage",
            maxCount: 1
        }
    ]),
    updateCreator
);
route.get("/getposts",auth_middleware,creator_middleware,getPost);
route.get("/get-single-post/:id",auth_middleware,creator_middleware,getSinglePost);
route.put("/update-post/:id",auth_middleware,creator_middleware,updatePost);
route.delete("/delete-post/:id",auth_middleware,creator_middleware,deletePost);

module.exports=route;