/**
 * customError class extends the built-in JavaScript Error class.
 * It allows creating errors with a custom HTTP status code and message.
 * 
 * Usage:
 * throw new customError(404, "Resource not found");
 * 
 * This can be used in Express apps to standardize error handling.
 */

class customError extends Error {
    constructor(status, message) {
        super(); // Call the parent Error constructor
        this.status = status; // HTTP status code for the error
        this.message = message; // Custom error message
    }
}

module.exports = customError;