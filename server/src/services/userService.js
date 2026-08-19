
const bcrypt=require("bcryptjs");
const mail=require("../services/mailService")
const config=require("../config/config")
const otpGenerator=require("otp-generator");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    ValidationError
}=require("../errors/AppError");
const logger=require("../utils/logger");
const LOG_EVENTS = require("../constants/logEvents");

const mongoose=require("mongoose");
const jwt=require("jsonwebtoken")
const {
    existingUser,
    existingUsername,
    existingEmail,
    existingPassword,
    createPartialUser,
    existingPartialUser,
    createUser,
    removePartialUser
}=require("../repository/user_repository");
const logEvents = require("../constants/logEvents");

const UserPartialRegisterService=async(data)=>{ 
    const session=await mongoose.startSession();
    try{
        const {username,email,password}=data;
        await session.startTransaction();
        //check is username exist
        if(await existingUsername(username)){
            logger.warn({
                event:LOG_EVENTS.USERNAME_ALREADY_EXIST
            })
            throw new BadRequestError("Username already exist!")
        }
        //check is email exist
        if(await existingEmail(email)){
            logger.warn({
                event:LOG_EVENTS.EMAIL_ALREADY_EXIST
            })
            throw new BadRequestError("Email already exist!")
        }
        const salt=await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        // logger.info({
        //     event:LOG_EVENTS.PASSWORD_HASHED,
        //     data:hashPassword
        // })

        const otp=await otpGenerator.generate(4,{
            lowerCaseAlphabets:false,
            upperCaseAlphabets:false,
            specialChars:false
        })
        const partialUser = await createPartialUser({
            username,
            email,
            password:hashPassword,
            otp
        },session);
        const userId = partialUser[0]._id;
        // send otp
        await mail.otp(email,otp);
        logger.info({
            event:LOG_EVENTS.OTP_DELIVERED
        })
        await session.commitTransaction();
        return userId;
    }catch(err){
        await session.abortTransaction();
        throw err;
    }finally{
        await session.endSession();
    } 
}
const UserRegisterService=async(data)=>{
    const session=await mongoose.startSession();
    try{
            const {id,enteredOTP}=data;
            await session.startTransaction();
            //check is username exist
            const UserData=await existingPartialUser(id);
            if(!UserData){
                logger.warn({
                    event:LOG_EVENTS.USER_NOT_EXIST
                })
                throw new BadRequestError("OTP not exist!")
            }
            const {username,email,password,role,otp,createdAt}=UserData;
            const currentTime=Date.now();
            
            if(currentTime-createdAt>300000){
                logger.warn({
                    event:LOG_EVENTS.OTP_EXPIRED
                })
                throw new BadRequestError("OTP expired!")
            }
    
            if(enteredOTP!=otp && otp){
                logger.warn({
                    event:LOG_EVENTS.INVALID_OTP
                })
                throw new BadRequestError("Invaild OTP!")
            }
            const newUser= await createUser({
                username,
                email,
                password
            },session)
            await removePartialUser(email);
            await mail.user(email,username);
            logger.info({
                event:LOG_EVENTS.USER_REGISTERED
            });
            await session.commitTransaction();
        }catch(err){
            await session.abortTransaction();
            throw err;
        }finally{
            await session.endSession();
        }

}
const UserLoginService=async(body)=>{

        const {username,password}=body;
        const user=await existingUsername(username);

        if(!user){
                logger.warn({
                    message:LOG_EVENTS.INVALID_USER
                })
                throw new BadRequestError("invalid username!")
        }
        if(!await existingPassword(user._id,password)){
                logger.warn({
                    message:LOG_EVENTS.INVALID_PASSWORD
                })
                throw new BadRequestError("invalid password!")
        }
        const accessToken=await jwt.sign({
                userid:user._id,
                username:user.username,
                email:user.email,
                role:user.role
            },config.jwt.secret,{
                    
            })
        return accessToken;
    
}

const UserPartialRegisterV2Service=async(data)=>{ 
    const session=await mongoose.startSession();
    try{
        const {username,email,password}=data;
        await session.startTransaction();
        //check is username exist
        if(await existingUsername(username)){
            logger.warn({
                event:LOG_EVENTS.USERNAME_ALREADY_EXIST
            })
            throw new BadRequestError("Username already exist!")
        }
        //check is email exist
        if(await existingEmail(email)){
            logger.warn({
                event:LOG_EVENTS.EMAIL_ALREADY_EXIST
            })
            throw new BadRequestError("Email already exist!")
        }
        const salt=await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        // logger.info({
        //     event:LOG_EVENTS.PASSWORD_HASHED,
        //     data:hashPassword
        // })

        const otp=await otpGenerator.generate(4,{
            lowerCaseAlphabets:false,
            upperCaseAlphabets:false,
            specialChars:false
        })
        const partialUser = await createPartialUser({
            username,
            email,
            password:hashPassword,
            otp
        },session);
        const userId = partialUser[0]._id;
        logger.info({
            event:LOG_EVENTS.REGISTERED_PARTIALLY
        })
        await session.commitTransaction();
        return userId;
    }catch(err){
        await session.abortTransaction();
        throw err;
    }finally{
        await session.endSession();
    } 
}
const UserRegisterV2Service=async(data)=>{
    const session=await mongoose.startSession();
    try{
            const {id}=data;
            await session.startTransaction();
            //check is username exist
            const UserData=await existingPartialUser(id);
            if(!UserData){
                logger.warn({
                    event:LOG_EVENTS.USER_NOT_EXIST
                })
                throw new BadRequestError("OTP not exist!")
            }
            const {username,email,password,role}=UserData;

            const newUser= await createUser({
                username,
                email,
                password
            },session)
            await removePartialUser(email);
            await mail.user(email,username);
            logger.info({
                event:LOG_EVENTS.USER_REGISTERED
            });
            await session.commitTransaction();
        }catch(err){
            await session.abortTransaction();
            throw err;
        }finally{
            await session.endSession();
        }

}

module.exports={
    UserPartialRegisterService,
    UserRegisterService,
    UserLoginService,
    
    UserPartialRegisterV2Service,
    UserRegisterV2Service
}