const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const Model=require("./models/model.js");
const SampleData=require("./init/data.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const asyncWrap=require("./utils/asyncWrap.js");
const customError=require("./utils/customError.js");
const schemaValidation=require("./Schema.js");

app.set("port",3000);
const port=app.get("port");
app.listen(port,()=>{
    console.log("server is runing at "+port +"..........");
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(methodOverride('_method'));
app.use(express.urlencoded({exteneded:true}));
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

// Delte route
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

// route for individual item
app.get("/show/:id",asyncWrap(async (req,res)=>{
    let {id}=req.params;
    let data= await Model.findById(id);
    res.render("./listings/show",{data});
}));

// edit route
app.get("/edit/:id",asyncWrap(async (req,res)=>{
    let {id}=req.params;
    let data= await Model.findById(id);
    res.render("./listings/edit",{data});
}));

// update route
app.patch("/update/:id",asyncWrap(async (req,res)=>{
    let data=req.body;
    let{id}=req.params;
    await Model.findOneAndUpdate({_id:id},data,{new:true,runValidator:true});
    res.redirect(`/show/${id}`);
}));

// Add route
app.get("/new",(req,res)=>{
    res.render("./listings/new");
});

app.post("/insert",asyncWrap(async (req,res,next)=>{
    let data=req.body
    // console.log(data);
    let result=schemaValidation.validate(data);
    if(result.error){
        next(new customError(400,result.error));
    }
    const newData=new Model(data);
    await newData.save()
    console.log("inserted sucessfully");
    res.redirect("/listing");
}));

// delte route
app.delete("/delete/:id",asyncWrap(async (req,res)=>{
    let {id}=req.params;
    await Model.deleteOne({_id:id});
    res.redirect("/listing");
}));

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
 