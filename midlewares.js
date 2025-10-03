const Model=require("./models/listing.js");
const customError=require("./utils/customError.js");
const {schemaValidation}=require("./Schema.js");






// midleware for schemavalidation
// listing validation
module.exports.ListingValidation =(req,res,next)=>{
    let data=req.body
    let result=schemaValidation.validate(data);
    if(result.error){
        next(new customError(400,result.error));
    }else{
        next();
    }
}


// Review validation
module.exports.Reviewvalidation=(req,res,next)=>{
    let {error} = reviewSchemaValidation.validate(req.body);
    if(error){
        next(new customError(400,error));
    }else{
        next();
    }
}


// authentication check midleware
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        // Only save redirect for GET requests
        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        }
        req.flash("error","You must be logged in!");
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    res.locals.redirectUrl=req.session.redirectUrl;
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let list=await Model.findById(id);
    if(!list.owner._id.equals(req.user._id)){
        req.flash("error","you are not a owner to do this");
        return res.redirect(`/show/${id}`);   
    }
    next();
}

