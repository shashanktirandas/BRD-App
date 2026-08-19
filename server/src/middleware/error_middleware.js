const logger=require("../utils/logger")
const errorHandler=(err , req , res , next)=>{
    console.error(err);
    const statusCode =err.statusCode || 500;
    const message =
    err.message || "Internal Server Error";
    logger.error({
        event:"UNHANDLED_EXCEPTION",
        path:req.originalUrl,
        method:req.method,
        error:message
    });
    return res.status(statusCode).json({
        success:false,
        message
    })
}


module.exports=errorHandler;
