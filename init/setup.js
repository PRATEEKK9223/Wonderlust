const express = require("express");
const app = express();

const Model = require("../models/listing.js");
const SampleData = require("./data.js");
const mongoose = require("mongoose");



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

// TO start the server
app.set("port",3000);
const port=app.get("port");
app.listen(port,()=>{
    console.log("server is runing at "+port +"..........");
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


// To update the datby adding the owner to each
app.get("/update",async (req,res)=>{
    await Model.updateMany({},{$set:{owner:'68dbcde683709119a1365b7a'}});
    res.send("Updted sucessfully..");
});


// Setup route to reset and add sample data
app.get("/setup",async (req,res)=>{
    await Model.deleteMany({});
    await Model.insertMany(SampleData.data);
    await Model.updateMany({},{$set:{owner:'68dbcde683709119a1365b7a'}});
    res.send("setup done");
})