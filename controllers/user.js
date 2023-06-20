const User = require("../models/user");

module.exports.renderSignupForm = (req, res, next)=>{
    res.render("user/register.ejs")
}

module.exports.signup = async (req, res, next)=>{
    try{
    const {username, email, password} = req.body;
    const user =new User({username, email});
    const registerUser = await User.register(user, password);
    req.login(registerUser, err=>{
        if(err){
            next(err);
        }
        req.flash("success", "Successfully registered!")
        res.redirect("/campgrounds")
    })
    
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/register")
    }
}

module.exports.renderSigninForm = (req, res, next)=>{
    res.render("user/login.ejs");
}

module.exports.signin = (req, res, next)=>{
    const redirectUrl = res.locals.returnToUrl || "/campgrounds";
    delete res.locals.returnToUrl;
    req.flash("success","Logined successfully!" )
    res.redirect(redirectUrl)
}

module.exports.signout =  (req, res, next)=>{
    req.logout(function(err){
        if(err){
            next(err);
        }
    req.flash("success", "GoodBye!")
    res.redirect("/campgrounds") 
    });
}