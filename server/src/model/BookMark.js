const mongoose=require("mongoose");

const BookMark=new mongoose.Schema({
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"BirdPost",
        require:true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Bird user",
        require:true,
    }
})

module.exports= new mongoose.model("Post bookmark",BookMark);