const mongoose=require("mongoose");

const Comment=new mongoose.Schema({
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"BirdPost",
        required:true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Bird user",
        required:true,
    },
    comment:{
        type: String,
        ref: "post comment",
        required:true,
    },
})

module.exports= new mongoose.model("Post comments",Comment);