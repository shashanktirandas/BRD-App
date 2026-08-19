const express=require("express")
const auth_middleware=require("../middleware/auth_middleware")
const {
            TopBirdPosted,
            TopLikedBirdPosted,
            TopFollowedCreator
       }=require("../controllers/analytics-controller");

const route=express.Router();

route.get("/topbirds",auth_middleware,TopBirdPosted);
route.get("/toplikes",auth_middleware,TopLikedBirdPosted);
route.get("/topcreators",auth_middleware,TopFollowedCreator);

module.exports=route;

