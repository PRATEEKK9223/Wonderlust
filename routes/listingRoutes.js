const express=require("express");
const router=express.Router();
const Model=require("../models/listing.js");
const asyncWrap=require("../utils/asyncWrap.js");
const {ListingValidation,isLoggedIn,isOwner}=require("../midlewares.js");


// Listing route
router.get("/listing",asyncWrap(async (req,res)=>{
    let list=await Model.find();
    res.render("./listings/index",{list});
}));



// edit form route
router.get("/edit/:id",isLoggedIn,isOwner,asyncWrap(async (req,res)=>{
    let {id}=req.params;
    let data= await Model.findById(id);
    res.render("./listings/edit",{data});
}));

// update route
router.patch("/update/:id",ListingValidation,isOwner,asyncWrap(async (req,res)=>{
    let data=req.body;
    let{id}=req.params;
    await Model.findOneAndUpdate({_id:id},data,{new:true,runValidator:true});
    req.flash("success","listing updated!");
    res.redirect(`/show/${id}`);
    
}));

// Add form  route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("./listings/new");
});


// Add route
router.post("/insert",ListingValidation,asyncWrap(async (req,res)=>{
    const newData=new Model(req.body);
    newData.owner=req.user._id;
    await newData.save();
    req.flash("success","listing added!");
    res.redirect("/listing");
}));

// route for individual item
router.get("/show/:id",asyncWrap(async (req,res)=>{
    let {id}=req.params;
    let data= await Model.findById(id).populate({path:"Reviews",populate:{path:"author",},}).populate("owner");
    res.render("./listings/show",{data});
}));

// individual list delete route
router.delete("/delete/:id",isLoggedIn,isOwner,asyncWrap(async (req,res)=>{
    let {id}=req.params;
    await Model.findByIdAndDelete(id);
    req.flash("error","listing deleted!");
    res.redirect("/listing");
}));


module.exports=router;