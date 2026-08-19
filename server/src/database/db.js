const mongoose=require("mongoose");
const logger=require("../utils/logger")
const config=require("../config/config")
const ConnectDB=async()=>{
    try{
        await mongoose.connect(config.database.uri);
        logger.info({
            event:"DATABASE_CONNECTED"
        });
    }catch(err){
        logger.error({    
            event:"DATABASE_CONNECTION_FAILED",
            error:err.message
        });
    }
}
 module.exports=ConnectDB;