const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const Model=require("../models/listing.js");
const asyncWrap=require("../utils/asyncWrap.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../midlewares.js");




router.get("/signup",(req,res)=>{
   res.render("./user/signup");
});

router.post("/signup",asyncWrap(async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        let NewUser=new User({
            username:username,
            email:email,
        });
        const registeredUser=await User.register(NewUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }else{
                req.flash("success","welcome to woderlust "+username);
                res.redirect("/listing");    
            }
        })
       
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("./user/login");
});

router.post("/login",saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: "Invalid username or password!",}),(req,res)=>{
    req.flash("success","welcome back!");
    if(res.locals.redirectUrl){
         res.redirect(res.locals.redirectUrl);
    }else{
        res.redirect("/listing");
    }   
});


router.get("/logout",(req,res)=>[
    req.logout((err)=>{
        if(err){
            next(err);
        }else{
            req.flash("success","Logout successfully!!");
            res.redirect("/listing");
        }
    })
]);

module.exports=router;