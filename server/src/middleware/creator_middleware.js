const config=require("../config/config");
const logger=require("../utils/logger");
const {
    BadRequestError,
    UnauthorizedError
    }=require("../errors/AppError")
const PhotographerProfile = require("../model/PhotographerProfile");
const creatorMiddelware=async (req,res,next)=>{
        if(req.accessToken.role!=="creator"){
           throw new UnauthorizedError("creator access denied!");
        }
       next();
}

module.exports=creatorMiddelware;