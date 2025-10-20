const Model=require("../models/listing.js");


module.exports.index=async (req,res)=>{
    let list=await Model.find();
    res.render("./listings/index",{list});
};

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let data= await Model.findById(id);
    res.render("./listings/edit",{data});
};

module.exports.updateListing=async (req,res)=>{
    let data=req.body;
    if(req.file){
        let url=req.file.path;
        let filename=req.file.originalname;
        data.image={url,filename};
    }
    let{id}=req.params;
    await Model.findOneAndUpdate({_id:id},data,{new:true,runValidator:true});
    req.flash("success","listing updated!");
    res.redirect(`/show/${id}`);
};

module.exports.renderNewForm=(req,res)=>{
    res.render("./listings/new");
};

module.exports.insertListing=async (req,res)=>{
    let url=req.file.path;
    let filename=req.file.originalname;
    req.body.image={url,filename};
    const newData=new Model(req.body);
    newData.owner=req.user._id;
    await newData.save();
    req.flash("success","listing added!");
    res.redirect("/listing");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let data= await Model.findById(id).populate({path:"Reviews",populate:{path:"author",},}).populate("owner");
    res.render("./listings/show",{data});
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Model.findByIdAndDelete(id);
    req.flash("error","listing deleted!");
    res.redirect("/listing");
};