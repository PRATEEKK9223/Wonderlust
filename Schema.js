const joi=require("joi");

const SchemaValidation=joi.object({
    title: joi.string().min(3).max(30).required(),
    description:joi.string().max(100).required(),
    price:joi.number().min(0).required(),
    // image:joi.object({
    //     url:joi.allow("",null),
    //     filename:joi.allow("",null),
    // }), 
    country:joi.string().required(),
    location:joi.string().required(),
});

module.exports=SchemaValidation;