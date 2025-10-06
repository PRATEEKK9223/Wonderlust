
const express=require("express");
const router=express.Router();
// const User=require("../models/user.js");
// const Model=require("../models/listing.js");
const asyncWrap=require("../utils/asyncWrap.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../midlewares.js");
const userControllers=require("../controllers/users.js");


// ----------------------- AUTH ROUTES ----------------------- //

// // Signupform render route
// router.get("/signup",userControllers.renderSignupForm);

// // Signup post route
// router.post("/signup",asyncWrap(userControllers.signup));

// Signupform render route & Signup post route
router.route("/signup")
.get(userControllers.renderSignupForm)
.post(asyncWrap(userControllers.signup));


// // Login form render route`
// router.get("/login",userControllers.renderLoginForm);

// // Login post route
// router.post("/login",saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: "Invalid username or password!",}),userControllers.login);

// Login form render route & Login post route
router.route("/login")
.get(userControllers.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: "Invalid username or password!",}),userControllers.login);


// Logout route
router.get("/logout",userControllers.logout);


module.exports = router;