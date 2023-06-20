const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const flash = require("connect-flash")
const passport = require("passport");
const {storeReturnTo} = require("../middleware")
const Campground = require("../models/campground")
const user = require("../controllers/user")

router.get("/register", user.renderSignupForm);

router.post("/register", catchAsync( user.signup));

router.get("/login", user.renderSigninForm)

router.post("/login",storeReturnTo, passport.authenticate("local", {failureFlash: true, failureRedirect: "/login" }) , user.signin)

router.get("/logout", user.signout)

module.exports = router;