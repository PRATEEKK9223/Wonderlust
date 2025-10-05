const express = require("express");
const router = express.Router();
const User = require("../models/user.js"); // User model for authentication
const Model = require("../models/listing.js"); // Listing model (not used in this file but imported)
const asyncWrap = require("../utils/asyncWrap.js"); // Utility to handle async errors
const passport = require("passport"); // Passport for authentication
const { saveRedirectUrl } = require("../midlewares.js"); // Middleware to store redirect URL after login

// ----------------------- AUTH ROUTES ----------------------- //

// ---------- Register Routes ---------- //
// Render the signup form page
router.get("/signup", (req, res) => {
    res.render("./user/signup");
});

// Handle signup form submission
router.post(
    "/signup",
    asyncWrap(async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Create a new User instance
            let NewUser = new User({
                username: username,
                email: email,
            });

            // Register the user with Passport (handles password hashing)
            const registeredUser = await User.register(NewUser, password);

            // Automatically log in the newly registered user
            req.login(registeredUser, (err) => {
                if (err) {
                    next(err); // Pass error to Express error handler
                } else {
                    req.flash("success", "Welcome to Wonderlust, " + username);
                    res.redirect("/listing"); // Redirect to listings page after successful signup
                }
            });
        } catch (err) {
            req.flash("error", err.message);
            res.redirect("/signup"); // Redirect back to signup page if error occurs
        }
    })
);

// ---------- Login Routes ---------- //
// Render the login form page
router.get("/login", (req, res) => {
    res.render("./user/login");
});

// Handle login form submission
router.post(
    "/login",
    saveRedirectUrl, // Save the original URL user wanted to access
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Invalid username or password!",
    }),
    (req, res) => {
        req.flash("success", "Welcome back!");

        // Redirect user to their original destination if stored
        if (res.locals.redirectUrl) {
            res.redirect(res.locals.redirectUrl);
        } else {
            res.redirect("/listing"); // Default redirect after login
        }
    }
);

// ---------- Logout Route ---------- //
// Handle user logout
router.get("/logout", (req, res) => [
    req.logout((err) => {
        if (err) {
            next(err); // Pass error to Express error handler
        } else {
            req.flash("success", "Logout successfully!");
            res.redirect("/listing"); // Redirect to listings page after logout
        }
    }),
]);

module.exports = router;