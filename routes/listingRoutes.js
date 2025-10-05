const express = require("express");
const router = express.Router();
const Model = require("../models/listing.js"); // Listing model
const asyncWrap = require("../utils/asyncWrap.js"); // Utility to handle async errors
const { ListingValidation, isLoggedIn, isOwner } = require("../midlewares.js"); // Middlewares for validation, authentication, and ownership

// ------------------- LISTING ROUTES ------------------- //

// Route: GET /listing
// Description: Display all listings on the index page
router.get(
    "/listing",
    asyncWrap(async (req, res) => {
        const list = await Model.find(); // Fetch all listings from DB
        res.render("./listings/index", { list }); // Render index view with listings
    })
);

// Route: GET /edit/:id
// Description: Show the edit form for a specific listing
// Middleware: isLoggedIn ensures user is logged in, isOwner ensures user owns the listing
router.get(
    "/edit/:id",
    isLoggedIn,
    isOwner,
    asyncWrap(async (req, res) => {
        const { id } = req.params;
        const data = await Model.findById(id); // Fetch the specific listing
        res.render("./listings/edit", { data }); // Render edit form with listing data
    })
);

// Route: PATCH /update/:id
// Description: Update a specific listing with new data
// Middleware: ListingValidation validates input, isOwner ensures user owns the listing
router.patch(
    "/update/:id",
    ListingValidation,
    isOwner,
    asyncWrap(async (req, res) => {
        const data = req.body;
        const { id } = req.params;
        await Model.findOneAndUpdate(
            { _id: id },
            data,
            { new: true, runValidator: true } // Return updated doc and validate
        );
        req.flash("success", "Listing updated!"); // Flash message for success
        res.redirect(`/show/${id}`); // Redirect to updated listing page
    })
);

// Route: GET /new
// Description: Render form to add a new listing
// Middleware: isLoggedIn ensures only logged-in users can access
router.get("/new", isLoggedIn, (req, res) => {
    res.render("./listings/new"); // Render new listing form
});

// Route: POST /insert
// Description: Add a new listing to the database
// Middleware: ListingValidation ensures input is valid
router.post(
    "/insert",
    ListingValidation,
    asyncWrap(async (req, res) => {
        const newData = new Model(req.body); // Create new listing from form data
        newData.owner = req.user._id; // Set owner as currently logged-in user
        await newData.save(); // Save to DB
        req.flash("success", "Listing added!"); // Flash message for success
        res.redirect("/listing"); // Redirect to all listings
    })
);

// Route: GET /show/:id
// Description: Display a single listing with reviews and owner info
router.get(
    "/show/:id",
    asyncWrap(async (req, res) => {
        const { id } = req.params;
        const data = await Model.findById(id)
            .populate({
                path: "Reviews",
                populate: { path: "author" }, // Populate review authors
            })
            .populate("owner"); // Populate listing owner
        res.render("./listings/show", { data }); // Render show view with data
    })
);

// Route: DELETE /delete/:id
// Description: Delete a specific listing
// Middleware: isLoggedIn ensures user is logged in, isOwner ensures user owns the listing
router.delete(
    "/delete/:id",
    isLoggedIn,
    isOwner,
    asyncWrap(async (req, res) => {
        const { id } = req.params;
        await Model.findByIdAndDelete(id); // Delete listing from DB
        req.flash("error", "Listing deleted!"); // Flash message for deletion
        res.redirect("/listing"); // Redirect to all listings
    })
);

module.exports = router;