const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const Model=require("./models/listing.js");
const SampleData=require("./init/data.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const customError=require("./utils/customError.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

// importing routes
const Listings=require("./routes/listingRoutes.js");
const Reviews=require("./routes/reviewRoutes.js");
const Authentication=require("./routes/authenRoutes.js");



// ----------DB connection-----------
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

main().then((res)=>{
    console.log("DB Connection Successfully..");
}).catch((err)=>{
    console.log("DB Do not Connection Successfully..");
    console.log(err);
});


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


app.use(session({
    secret:"prk_wonderlust",
    resave:false,
    saveUninitialized:true,
}));
app.use(flash());


app.set("port",3000);
const port=app.get("port");
app.listen(port,()=>{
    console.log("server is runing at "+port +"..........");
});

// passport configaration

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// flash middleware
app.use((req,res,next)=>{
    res.locals.FlashMeassage1=req.flash("success");
    res.locals.FlashMeassage2=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});


// listing Rouets
app.use("/",Listings);

// Review Routes..
app.use("/",Reviews);

// authentication routes
app.use("/",Authentication);



// -----------------------------Routes-------------------------------------
// home route
app.get("/",async (req,res)=>{
    res.send("this is the home page");
});

// Initialize route
app.get("/initialize",async (req,res)=>{
    await Model.insertMany(SampleData.data);
    res.send("insered sucessfully");
});

// Delete every listing route 
app.get("/delete",(req,res)=>{
    Model.deleteMany().then((res)=>{
        console.log(res)
    }).catch((err)=>{
        console.log(err)
    })
    res.send("deleted sucessfully")
});





// to get all invalid routes requests
app.use((req,res,next)=>{
    next(new customError(404,"page Not Found"));
});

// Error handling middleware...
app.use((err,req,res,next)=>{
    const {status=500,message="Somthing went wrong"} = err;
    if(status===404){
        res.render("./listings/PageNotFound",{err});
    }else{
        res.render("./listings/Error",{err});
    }
});
 