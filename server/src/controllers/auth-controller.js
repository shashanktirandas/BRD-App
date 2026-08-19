const User=require("../model/User");
const PartialUser=require("../model/partial-user");
const bcrypt=require("bcryptjs")
const otpGenerator=require("otp-generator");
const logger=require("../utils/logger")
const successResponse=require("./successResponse")
const {
    UserPartialRegisterService,
    UserRegisterService,
    UserLoginService,
    UserPartialRegisterV2Service,
    UserRegisterV2Service
}=require("../services/userService")

const partial_signup=async(req,res)=>{
    const userid=await UserPartialRegisterService(req.body);
    successResponse(res,{
        message:"User partailly registered.",
        data:{
            userid:userid
        }
    })
}
const signup=async(req,res)=>{
    await UserRegisterService(req.body);
    successResponse(res,{
        message:"User registered."
    })
}
const login=async(req,res)=>{
    const accessToken=await UserLoginService(req.body);
    successResponse(res,{
        message:"User logged in",
        data:{
            token:accessToken
        }
    })
}

const partial_signupv2=async(req,res)=>{
    const userid=await UserPartialRegisterV2Service(req.body);
    successResponse(res,{
        message:"User partailly registered.",
        data:{
            userid:userid
        }
    })
}
const signupv2=async(req,res)=>{
    await UserRegisterV2Service(req.body);
    successResponse(res,{
        message:"User registered."
    })
}

module.exports={
    partial_signup,
    login,
    signup,
    partial_signupv2,
    signupv2
}