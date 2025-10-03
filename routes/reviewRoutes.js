const express=require("express");
const router=express.Router();

const ReviewModel=require("../models/Review.js");
const asyncWrap=require("../utils/asyncWrap.js");
const Model=require("../models/listing.js");
const {Reviewvalidation,isLoggedIn}=require("../midlewares.js");


// Review post route
router.post("/listing/:id/review",isLoggedIn,Reviewvalidation,asyncWrap(async (req,res)=>{
    let list=await Model.findById(req.params.id);
    let newReview=req.body;
    const review=new ReviewModel(newReview);
    review.author=res.locals.currentUser._id;
    await review.save();
    list.Reviews.push(review);
    await list.save();
    req.flash("success","Review added!");
    res.redirect(`/show/${req.params.id}`);
}));

// delete Review 
router.delete("/listing/:id/review/:reviewId",isLoggedIn,async (req,res)=>{
    let {id,reviewId}=req.params;
    let review=await ReviewModel.findById(reviewId).populate("author");
    if(review.author._id.equals(res.locals.currentUser._id)){
        await Model.findByIdAndUpdate(id,{$pull :{Reviews:reviewId}});
        await ReviewModel.findByIdAndDelete(reviewId);
        req.flash("success","Review deleted!");
        return res.redirect(`/show/${id}`);
    }
    req.flash("error","you aren't author of this review to delete!");
    res.redirect(`/show/${id}`);

});



module.exports=router;