const mongoose=require("mongoose");

const Follow=new mongoose.Schema({
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"PhotographerProfile",
        required:true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Bird user",
        required:true,
    }
})

Follow.index({
    creator: 1
});

Follow.index({
    user: 1
});

module.exports= new mongoose.model("Follow Creator",Follow);