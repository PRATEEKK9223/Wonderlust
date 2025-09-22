const mongoose =require("mongoose");

// creating schema and model for Review
const ReviewSchema=new mongoose.Schema({
    comment:String,
    rating:Number,
    createdAt:{
        type:Date,
        default:Date.now(),
    }
});

module.exports=mongoose.model("Review",ReviewSchema);