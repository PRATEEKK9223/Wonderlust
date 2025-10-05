const joi = require("joi");

// ---------------------------LISTING SCHEMA VALIDATION------------------
// Schema to validate listing data before saving/updating in the database
const schemaValidation = joi.object({
    title: joi.string()               // Listing title
        .min(3)
        .max(100)
        .required(),
    description: joi.string()         // Listing description
        .max(1000)
        .required(),
    price: joi.number()               // Listing price, must be >= 0
        .min(0)
        .required(),
    image: joi.object({               // Listing image details
        filename: joi.string()
            .default("file name"),    // Default filename if none provided
        url: joi.string()
            .uri()
            .allow("")                // Allow empty string
            .default("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60") // Default image URL
    }),
    country: joi.string()             // Country where the listing is located
        .required(),
    location: joi.string()            // Specific location of the listing
        .required(),
});

// ---------------------------REVIEW SCHEMA VALIDATION------------------
// Schema to validate review data before saving to the database
const reviewSchemaValidation = joi.object({
    rating: joi.number()              // Review rating: 1 to 5
        .min(1)
        .max(5)
        .required(),
    comment: joi.string()             // Review comment
        .required(),
});

// Export schemas for use in middleware
module.exports = {
    schemaValidation,
    reviewSchemaValidation,
};