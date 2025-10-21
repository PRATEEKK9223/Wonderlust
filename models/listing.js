const mongoose =require("mongoose");
const review=require("./Review.js");

const Schema=new mongoose.Schema({
    title:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    image:{
        filename:{
            type:String,
            require:true,
            default:"file name",
        },
        url:{
            type:String,
            default:"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
            set:(v)=>{
                if(!v){
                    return "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"        
                }else{
                    return v;
                }
            }
        },
    },
    price:{
        type:Number,
        require:true,
    },
    location:{
        type:String,
        require:true,
    },
    country:{
        type:String,
        require:true,
    },
    Reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },

     geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
  }


});

Schema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in : listing.Reviews}});
    }else{
        next();
    }
})


const Listing= new mongoose.model("Listing",Schema);

module.exports=Listing;