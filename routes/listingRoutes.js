const express=require("express");
const router=express.Router();
const Model=require("../models/listing.js");
const asyncWrap=require("../utils/asyncWrap.js");
const {schemaValidation}=require("../Schema.js");
const customError=require("../utils/customError.js");



// midleware for schemavalidation
// listing validation
const ListingValidation =(req,res,next)=>{
    let data=req.body
    let result=schemaValidation.validate(data);
    if(result.error){
        next(new customError(400,result.error));
    }else{
        next();
    }
}

// Listing route
router.get("/listing",asyncWrap(async (req,res)=>{
    let list=await Model.find();
    res.render("./listings/index",{list});
}));



// edit form route
router.get("/edit/:id",asyncWrap(async (req,res)=>{
    let {id}=req.params;
    let data= await Model.findById(id);
    res.render("./listings/edit",{data});
}));

// update route
router.patch("/update/:id",ListingValidation,asyncWrap(async (req,res)=>{
    let data=req.body;
    let{id}=req.params;
    await Model.findOneAndUpdate({_id:id},data,{new:true,runValidator:true});
    req.flash("success","listing updated successfully");
    res.redirect(`/show/${id}`);
}));

// Add form  route
router.get("/new",(req,res)=>{
    res.render("./listings/new");
});


// Add route
router.post("/insert",ListingValidation,asyncWrap(async (req,res)=>{
    const newData=new Model(req.body);
    await newData.save();
    req.flash("success","New listing added");
    res.redirect("/listing");
}));

// route for individual item
router.get("/show/:id",asyncWrap(async (req,res)=>{
    let {id}=req.params;
    let data= await Model.findById(id).populate("Reviews");
    res.render("./listings/show",{data});

}));

// individual list delete route
router.delete("/delete/:id",asyncWrap(async (req,res)=>{
    let {id}=req.params;
    await Model.findByIdAndDelete(id);
    req.flash("deleted","listing deleted successfully");
    res.redirect("/listing");
}));


module.exports=router;