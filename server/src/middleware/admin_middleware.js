
const config=require("../config/config");
const logger=require("../utils/logger");
const {
    UnauthorizedError
    }=require("../errors/AppError")
const adminMiddelware=async (req,res,next)=>{
        if(req.accessToken.role!=="admin"){
            throw new UnauthorizedError("admin access denied!");
        }
       next();
}

module.exports=adminMiddelware;