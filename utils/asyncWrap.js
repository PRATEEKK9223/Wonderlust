/**
 * asyncWrap is a utility function to simplify error handling in async route handlers.
 * It wraps an asynchronous function and automatically passes any errors to Express's `next()` middleware.
 * 
 * Usage:
 * router.get('/route', asyncWrap(async (req, res) => {
 *    // async code here
 * }));
 * 
 * This prevents the need for repetitive try-catch blocks in every route.
 */

function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err)); // Catch errors and forward to Express error handler
    };
}

module.exports = asyncWrap;