
module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        console.log(req.originalUrl);
        req.flash("error", "You must login first")
        res.redirect("/login")
    }else
        next();
}

module.exports.storeReturnTo = (req, res, next)=>{
    if(req.session.returnTo){
        res.locals.returnToUrl = req.session.returnTo;
    }
    next();
}