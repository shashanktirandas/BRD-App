
const jwt=require('jsonwebtoken')
const config=require("../config/config");
const logger=require("../utils/logger");
const {
    BadRequestError,
    UnauthorizedError
    }=require("../errors/AppError")
const authMiddelware=async (req,res,next)=>{
        const authHeader=req.headers["authorization"];
       //console.log(authHeader)

       const token=authHeader && authHeader.split(" ")[1];
       //console.log(token);
       if(!token){
           throw new UnauthorizedError("access denied. no token provided!");
       }
       
       const user= jwt.verify(token,config.jwt.secret);
       if(!user){
        throw new BadRequestError("token is invalid or expired!");
       }
       //console.log(user);
       req.accessToken=user;
       next();
}

module.exports=authMiddelware;