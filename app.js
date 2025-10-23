// ---------------------------IMPORTS---------------------------------
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const customError = require("./utils/customError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
require('dotenv').config();

// Importing route modules
const Listings = require("./routes/listingRoutes.js");
const Reviews = require("./routes/reviewRoutes.js");
const Authentication = require("./routes/authenRoutes.js");

// ---------------------------DATABASE CONNECTION--------------------
// Connect to MongoDB using Mongoose
async function main() {
    await mongoose.connect(process.env.MANGO_ATLAS_URL); //"mongodb://127.0.0.1:27017/wonderlust"(for local)
}

main()
    .then(() => console.log("DB Connection Successfully.."))
    .catch((err) => {
        console.log("DB Connection Failed..");
        console.log(err);
    });

// ---------------------------APP CONFIGURATION----------------------
// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", ejsMate);

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to support PUT/PATCH/DELETE via forms
app.use(methodOverride('_method'));

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------SESSION & FLASH------------------------

const store = MongoStore.create({
  mongoUrl: process.env.MANGO_ATLAS_URL,
  crypto: {
    secret: process.env.SECRETE,
  },
  toucgAfter:24*3600,

})
store.on("error",()=>{
    console.log("Session Store Error");
})
// Configure session for user authentication
app.use(session({
    store,
    secret: process.env.SECRETE, // secret for signing session ID cookie
    resave: false, // avoid resaving session if not modified
    saveUninitialized: true, // save new sessions
}));

// Enable flash messages for notifications
app.use(flash());

// ---------------------------PASSPORT CONFIGURATION-----------------
// Initialize passport and session support
app.use(passport.initialize());
app.use(passport.session());

// Configure passport to use local strategy with User model
passport.use(new LocalStrategy(User.authenticate()));

// Serialize and deserialize user for session persistence
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ---------------------------FLASH MIDDLEWARE-----------------------
// Make flash messages & current user available in all templates
app.use((req, res, next) => {
    res.locals.FlashMeassage1 = req.flash("success");
    res.locals.FlashMeassage2 = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// ---------------------------ROUTES---------------------------------

app.get("/", (req, res) => {
    res.redirect("/listing");
});

// Listing routes
app.use("/", Listings);

// Review routes
app.use("/", Reviews);

// Authentication routes
app.use("/", Authentication);


// ---------------------------ERROR HANDLING------------------------
// Catch-all for invalid routes (404)
app.use((req, res, next) => {
    next(new customError(404, "Page Not Found"));
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;

    if (status === 404) {
        // Render custom 404 page
        res.render("./listings/PageNotFound", { err });
    } else {
        // Render generic error page for other errors
        res.render("./listings/Error", { err });
    }
});

// ---------------------------SERVER LISTEN--------------------------
app.set("port", 3000);
const port = app.get("port");

app.listen(port, () => {
    console.log("Server is running at " + port + "...");
});