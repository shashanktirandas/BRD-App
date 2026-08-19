const express=require("express");

const route=express.Router();

route.get("/",(req,res)=>{
    res.status(201).json({
        success:true,
        message:"hey this s main route"
    })
})

module.exports=route;