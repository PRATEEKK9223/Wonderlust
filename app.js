const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const Model=require("./models/listing.js");
const SampleData=require("./init/data.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const customError=require("./utils/customError.js");
const Listings=require("./routes/listingRoutes.js");
const Reviews=require("./routes/reviewRoutes.js");



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

// listing Rouets
app.use("/",Listings);

// Review Routes..
app.use("/",Reviews);




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
 