
const express=require("express");
const router=express.Router();
// const Model=require("../models/listing.js");
const asyncWrap=require("../utils/asyncWrap.js");
const {ListingValidation,isLoggedIn,isOwner}=require("../midlewares.js");
const listingControllers=require("../controllers/listings.js");
const multer  = require('multer');
const{storage}=require("../cloudConfigure.js");
const upload = multer({ storage });



// ------------------- LISTING ROUTES ------------------- //


// Listing route
router.get("/listing",asyncWrap(listingControllers.index));


// edit form route
router.get("/edit/:id",isLoggedIn,isOwner,asyncWrap(listingControllers.renderEditForm));

// update route
router.patch("/update/:id",upload.single("image"),ListingValidation,isOwner,asyncWrap(listingControllers.updateListing));

// Add form  route
router.get("/new",isLoggedIn,listingControllers.renderNewForm);


 
// Add route
router.post("/insert",upload.single("image"),asyncWrap(listingControllers.insertListing));

// route for individual item
router.get("/show/:id",asyncWrap(listingControllers.showListing));

// individual list delete route
router.delete("/delete/:id",isLoggedIn,isOwner,asyncWrap(listingControllers.destroyListing));




module.exports = router;