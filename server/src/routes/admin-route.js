const express=require("express");
const auth_middleware=require("../middleware/auth_middleware");
const admin_middleware=require("../middleware/admin_middleware");
const {welcome}=require("../controllers/admin-controller")

const route=express.Router();

route.get('/welcome',auth_middleware,admin_middleware,welcome)
module.exports=route;