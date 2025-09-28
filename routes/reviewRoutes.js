const express=require("express");
const router=express.Router();

const ReviewModel=require("../models/Review.js");
const {reviewSchemaValidation}=require("../Schema.js");
const asyncWrap=require("../utils/asyncWrap.js");
const Model=require("../models/listing.js");
const customError=require("../utils/customError.js");

// Review validation
const Reviewvalidation=(req,res,next)=>{
    let {error} = reviewSchemaValidation.validate(req.body);
    if(error){
        next(new customError(400,error));
    }else{
        next();
    }
}

// Review post route
router.post("/listing/:id/review",Reviewvalidation,asyncWrap(async (req,res)=>{
    let list=await Model.findById(req.params.id);
    let newReview=req.body;
    const review=new ReviewModel(newReview);
    await review.save();
    list.Reviews.push(review);
    await list.save();
    res.redirect(`/show/${req.params.id}`);
}));

// delete Review 
router.delete("/listing/:id/review/:reviewId",async (req,res)=>{
    let {id,reviewId}=req.params;
    let list=await Model.findByIdAndUpdate(id,{$pull :{Reviews:reviewId}});
    let review=await ReviewModel.findByIdAndDelete(reviewId);
    res.redirect(`/show/${id}`);
});



module.exports=router;