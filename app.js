const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const Model=require("./models/listing.js");
const SampleData=require("./init/data.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const asyncWrap=require("./utils/asyncWrap.js");
const customError=require("./utils/customError.js");
const {schemaValidation,reviewSchemaValidation}=require("./Schema.js");
const ReviewModel=require("./models/Review.js");

app.set("port",3000);
const port=app.get("port");
app.listen(port,()=>{
    console.log("server is runing at "+port +"..........");
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


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
// Review validation
const Reviewvalidation=(req,res,next)=>{
    let {error} = reviewSchemaValidation.validate(req.body);
    if(error){
        next(new customError(400,error));
    }else{
        next();
    }
}


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

// Listing route
app.get("/listing",asyncWrap(async (req,res)=>{
    let list=await Model.find();
    // console.log(list);
    res.render("./listings/index",{list});
}));



// edit form route
app.get("/edit/:id",asyncWrap(async (req,res)=>{
    let {id}=req.params;
    let data= await Model.findById(id);
    res.render("./listings/edit",{data});
}));

// update route
app.patch("/update/:id",ListingValidation,asyncWrap(async (req,res)=>{
    let data=req.body;
    let{id}=req.params;
    await Model.findOneAndUpdate({_id:id},data,{new:true,runValidator:true});
    res.redirect(`/show/${id}`);
}));

// Add form  route
app.get("/new",(req,res)=>{
    res.render("./listings/new");
});


// Add route
app.post("/insert",ListingValidation,asyncWrap(async (req,res)=>{
    const newData=new Model(req.body);
    await newData.save()
    console.log("inserted sucessfully");
    res.redirect("/listing");
}));

// route for individual item
app.get("/show/:id",asyncWrap(async (req,res)=>{
    let {id}=req.params;
    let data= await Model.findById(id).populate("Reviews");
    res.render("./listings/show",{data});

}));

// individual list delete route
app.delete("/delete/:id",asyncWrap(async (req,res)=>{
    let {id}=req.params;
    await Model.findByIdAndDelete(id);
    res.redirect("/listing");
}));

// Review post route
app.post("/listing/:id/Review",Reviewvalidation,asyncWrap(async (req,res)=>{
    let list=await Model.findById(req.params.id);
    let newReview=req.body;
    const review=new ReviewModel(newReview);
    await review.save();
    list.Reviews.push(review);
    await list.save();
    res.redirect(`/show/${req.params.id}`);
}));

// delete Review 
app.delete("/listing/:id/review/:reviewId",async (req,res)=>{
    let {id,reviewId}=req.params;
    let list=await Model.findByIdAndUpdate(id,{$pull :{Reviews:reviewId}});
    let review=await ReviewModel.findByIdAndDelete(reviewId);
    res.redirect(`/show/${id}`);
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
 