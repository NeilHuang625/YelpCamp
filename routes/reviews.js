const express = require("express");
const router = express.Router({mergeParams:true});
const {campgroundSchema, reviewSchema} = require("../schema");
const Review = require("../models/review");
const Campground = require('../models/campground');
const methodOverride = require("method-override");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const validateReview = (req, res, next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
};

router.post("/", validateReview, catchAsync( async (req, res, next)=>{
    const review = new Review(req.body.review);
    const campground =await Campground.findById(req.params.id);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash("success", " Review created!")
    res.redirect(`/campgrounds/${campground._id}`);
} ))



router.delete("/:review_id", async (req, res, next)=>{
    const {id, review_id} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:review_id}})
    await Review.findByIdAndDelete(review_id);
    req.flash("success", " Review deleted!")
    res.redirect(`/campgrounds/${id}`);
})

module.exports = router;