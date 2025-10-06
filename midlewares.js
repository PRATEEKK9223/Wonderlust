const Model = require("./models/listing.js");
const customError = require("./utils/customError.js");
const { schemaValidation, reviewSchemaValidation } = require("./Schema.js");

// ---------------------------SCHEMA VALIDATION MIDDLEWARE------------------

// Middleware to validate listing data before saving/updating
module.exports.ListingValidation = (req, res, next) => {
    const data = req.body;
    const result = schemaValidation.validate(data);

    if (result.error) {
        // Pass validation error to error handler
        next(new customError(400, result.error));
    } else {
        next();
    }
};

// Middleware to validate review data before saving
module.exports.Reviewvalidation = (req, res, next) => {
    const { error } = reviewSchemaValidation.validate(req.body);

    if (error) {
        // Pass validation error to error handler
        next(new customError(400, error));
    } else {
        next();
    }
};

// ---------------------------AUTHENTICATION MIDDLEWARE------------------

// Middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Only save redirect URL for GET requests
        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        }
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

// Middleware to make saved redirect URL available in response locals
module.exports.saveRedirectUrl = (req, res, next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
};

// ---------------------------AUTHORIZATION MIDDLEWARE------------------

// Middleware to check if the current user is the owner of a listing
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const list = await Model.findById(id);

    if (!list.owner._id.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/show/${id}`);
    }
    next();
};