module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        // Only save redirect for GET requests
        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        }
        req.flash("error","You must be logged in!");
        return res.redirect("/login")
    }
    next();
}


module.exports.saveRedirectUrl=(req,res,next)=>{
    res.locals.redirectUrl=req.session.redirectUrl;
    next();
}