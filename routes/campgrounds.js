const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require('../models/campground');
const methodOverride = require("method-override");
const {campgroundSchema, reviewSchema} = require("../schema");

const validateCampground = (req,res,next)=>{
    
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",")
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
};


router.get("/", catchAsync( async (req, res, next)=>{
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}));

router.get("/new", (req, res)=>{
    res.render("campgrounds/new");
});

router.post("/", validateCampground, catchAsync( async (req, res,next)=>{
    
    const {campground} = req.body;      // same as: const campground = req.body.campground;
    const newCamp = await new Campground(campground);
    await newCamp.save();
    req.flash("success", "New Campground Added");
    res.redirect(`/campgrounds/${newCamp._id}`);
  
}));

router.get("/:id/edit", catchAsync( async (req, res,next)=>{
    const {id} = req.params;
    const campground =await Campground.findById(id);
    res.render("campgrounds/edit", {campground} )
}));

router.put("/:id", validateCampground, catchAsync( async (req, res,next)=>{
    const {id} = req.params;
    // req.body = {campground: {title:{...} ,location: {...}   }   }
    const updateCamp = await Campground.findByIdAndUpdate(id, {...req.body.campground}); 
    await updateCamp.save();
    req.flash("success", "Successfully updated !")
    res.redirect(`/campgrounds/${updateCamp._id}`);
}));

router.delete("/:id", catchAsync( async (req, res,next)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success"," Campground Deleted!")
    res.redirect("/campgrounds")
}));

router.get("/:id", catchAsync( async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate("reviews");

    if(!campground){
        req.flash("error", "Can't find the page!");
        res.redirect("/campgrounds");
    }

    res.render("campgrounds/show", {campground});

}));

module.exports = router;