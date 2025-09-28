const joi=require("joi");

// this is schema validation for Listing
const schemaValidation=joi.object({
    title: joi.string().min(3).max(100).required(),
    description:joi.string().max(1000).required(),
    price:joi.number().min(0).required(),
    image: joi.object({
    filename: joi.string().default("file name"),
    url: joi.string().uri().allow("").default("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60")
  }),
    country:joi.string().required(),
    location:joi.string().required(),
});

// module.exports.SchemaValidation;

// schemavalidation for Review 

const reviewSchemaValidation=joi.object({
    rating:joi.number().min(1).max(5).required(),
    comment:joi.string().required(),
});

// module.exports.ReviewValidation;

module.exports={
  schemaValidation,
  reviewSchemaValidation,
}
