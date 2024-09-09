const express = require("express");
const router = express.Router({mergeParams:true});
const {campgroundSchema, reviewSchema} = require("../schema");
const Review = require("../models/review");
const Campground = require('../models/campground');
const methodOverride = require("method-override");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware")
const review =require("../controllers/review");

router.post("/",isLoggedIn, validateReview, catchAsync( review.createReview ))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor , review.deleteReview)

module.exports = router;