const User=require("../model/User");
const PartialUser=require("../model/partial-user");
const bcrypt=require("bcryptjs")
const existingUser=async(userid)=>{
    return await User.findById(userid)
}

const existingUsername=async(username)=>{
    return await User.findOne({username})
}

const existingEmail=async(email)=>{
    return await User.findOne({email})
}

const existingPassword=async(id,password)=>{
    const user=await User.findById(id);
    return bcrypt.compare(password,user.password);
}


const createPartialUser=async({
            username,
            email,
            password,
            otp
        },session)=>{

            return await PartialUser.create([{
                username,
                email,
                password,
                otp,
                createdAt:Date.now()
            }],{
            session
        })
}
const existingPartialUser=async(userid)=>{
    return await PartialUser.findById(userid)
}
const  createUser=async(data,session)=>{
    const {
            username,
            email,
            password
         } = data;
    return await User.create([{
            username,
            email,
            password
        }],{
            session
        });
}

const removePartialUser=async(email,session)=>{
    //return await PartialUser.findByIdAndDelete(userid)
    return await PartialUser.deleteMany({
                            email: {
                                $in:email
                            }
                        },session);
}

const updateById=async(userid,updatedData)=>{
    return await User.findByIdAndUpdate(userid,updatedData,{ returnDocument: "after" });
}

const userById=async(userid)=>{
    return await User.findById(userid);
}

module.exports={
    existingUser,
    existingUsername,
    existingEmail,
    existingPassword,
    createPartialUser,
    existingPartialUser,
    createUser,
    removePartialUser,
    updateById,
    userById
}