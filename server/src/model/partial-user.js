const mongooose=require("mongoose");
const { type } = require("node:os");

const User=new mongooose.Schema({
    username:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        enum:["user", "creator", "admin"],
        default:"user"
    },
    otp:{
        type:Number
    }
},{timestamps:true})

module.exports= mongooose.model("Bird partial user",User);