const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const flash = require("connect-flash")
const passport = require("passport");



router.get("/register", (req, res, next)=>{
    res.render("user/register.ejs");
})

router.post("/register", catchAsync( async (req, res, next)=>{
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
}))

router.get("/login", (req, res, next)=>{
    res.render("user/login.ejs");
})

router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login" }) , (req, res, next)=>{
    req.flash("success","Logined successfully!" )
    res.redirect("/campgrounds")
})

router.get("/logout", (req, res, next)=>{
    req.logout(function(err){
        if(err){
            next(err);
        }
    req.flash("success", "GoodBye!")
    res.redirect("/campgrounds")
        
    });
    
})

module.exports = router;