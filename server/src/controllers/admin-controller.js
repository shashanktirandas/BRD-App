
const { success } = require("zod");
const logger=require("../utils/logger");
const successResponse=require("./successResponse")
const welcome=async(req,res)=>{
        const {username}=req.accessToken;
        successResponse(res,{
            event:`welcome to admin id ${username} `
        })
}

module.exports={welcome}