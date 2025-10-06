const express=require("express");
const router=express.Router();

// const ReviewModel=require("../models/Review.js");
const asyncWrap=require("../utils/asyncWrap.js");
// const Model=require("../models/listing.js");
const {Reviewvalidation,isLoggedIn}=require("../midlewares.js");
const reviewsController=require("../controllers/reviews.js");


// Review post route
router.post("/listing/:id/review",isLoggedIn,Reviewvalidation,asyncWrap(reviewsController.addReview));

// delete Review 
router.delete("/listing/:id/review/:reviewId",isLoggedIn,reviewsController.destroyReview);



module.exports=router;