const mongoose=require("mongoose");

const Like=new mongoose.Schema({
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"BirdPost",
        required:true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Bird user",
        required:true,
    }
})

Like.index({
    post: 1
});

Like.index({
    user: 1
});

module.exports= new mongoose.model("Post likes",Like);