
const User=require("../models/user.js");


module.exports.renderSignupForm=(req,res)=>{
   res.render("./user/signup");
};


module.exports.signup=async (req,res)=>{
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
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("./user/login");
};

module.exports.login=(req,res)=>{
    req.flash("success","welcome back!");
    if(res.locals.redirectUrl){
         res.redirect(res.locals.redirectUrl);
    }else{
        res.redirect("/listing");
    }   
};

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }else{
            req.flash("success","Logout successfully!!");
            res.redirect("/listing");
        }
    })
};