const express = require("express");
const router = express.Router();
const ReviewModel = require("../models/Review.js"); // Review model
const asyncWrap = require("../utils/asyncWrap.js"); // Utility to handle async errors
const Model = require("../models/listing.js"); // Listing model
const { Reviewvalidation, isLoggedIn } = require("../midlewares.js"); // Middlewares for validation and authentication

// ------------------- REVIEW ROUTES ------------------- //

// Route: POST /listing/:id/review
// Description: Add a new review to a specific listing
// Middleware: isLoggedIn ensures user is logged in, Reviewvalidation ensures input is valid
router.post(
  "/listing/:id/review",
  isLoggedIn,
  Reviewvalidation,
  asyncWrap(async (req, res) => {
    const list = await Model.findById(req.params.id); // Find the listing by ID
    const newReview = req.body; // Get review data from request body
    const review = new ReviewModel(newReview); // Create new review instance
    review.author = res.locals.currentUser._id; // Set the review author as the current user
    await review.save(); // Save review to DB
    list.Reviews.push(review); // Add review reference to the listing
    await list.save(); // Save updated listing
    req.flash("success", "Review added!"); // Flash success message
    res.redirect(`/show/${req.params.id}`); // Redirect back to the listing page
  })
);

// Route: DELETE /listing/:id/review/:reviewId
// Description: Delete a review from a listing
// Middleware: isLoggedIn ensures user is logged in
router.delete(
  "/listing/:id/review/:reviewId",
  isLoggedIn,
  async (req, res) => {
    const { id, reviewId } = req.params;
    const review = await ReviewModel.findById(reviewId).populate("author"); // Get review and populate author

    // Check if current user is the author of the review
    if (review.author._id.equals(res.locals.currentUser._id)) {
      await Model.findByIdAndUpdate(id, { $pull: { Reviews: reviewId } }); // Remove review reference from listing
      await ReviewModel.findByIdAndDelete(reviewId); // Delete review from DB
      req.flash("success", "Review deleted!"); // Flash success message
      return res.redirect(`/show/${id}`); // Redirect back to listing
    }

    // If user is not the author
    req.flash("error", "You aren't the author of this review to delete!");
    res.redirect(`/show/${id}`); // Redirect back to listing
  }
);

module.exports = router;