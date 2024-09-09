const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next)=>{
    const review = new Review(req.body.review);
    const campground =await Campground.findById(req.params.id);
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash("success", " Review created!")
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res, next)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " Review deleted!")
    res.redirect(`/campgrounds/${id}`);
}