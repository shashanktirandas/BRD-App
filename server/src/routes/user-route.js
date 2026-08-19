
const express=require("express");
const auth_middleware=require("../middleware/auth_middleware");
const { 
        deleteUser,
        updateUser,
        getUser
        }=require("../controllers/user-controller")

const route=express.Router();

route.get('/delete',auth_middleware,deleteUser)
route.put('/update',auth_middleware,updateUser)
route.get('/get',auth_middleware,getUser)

module.exports=route;