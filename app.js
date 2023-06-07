const express = require("express");
const app = express();
const Joi = require("joi")
const {campgroundSchema, reviewSchema} = require("./schema");
const path = require("path");
const ejsMate = require("ejs-mate")
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const Campground = require('./models/campground');
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const Review = require("./models/review");

const validateCampground = (req,res,next)=>{
    
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",")
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
};

const validateReview = (req, res, next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
};


mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;

db.on('error', err => {
    logError(err);
  });
db.once("open", ()=>{
    console.log("Connected to the database! aha!");
})

app.engine("ejs", ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/",(req,res)=>{
    res.send("Hello It work!");
});

app.get("/campgrounds", catchAsync( async (req, res, next)=>{
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}));

app.get("/campgrounds/new", (req, res)=>{
    res.render("campgrounds/new");
});

app.post("/campgrounds", validateCampground, catchAsync( async (req, res,next)=>{
    
    const {campground} = req.body;      // same as: const campground = req.body.campground;
    const newCamp = await new Campground(campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
  
}));

app.post("/campgrounds/:id/review", validateReview, catchAsync( async (req, res, next)=>{
    const review = new Review(req.body.review);
    const campground =await Campground.findById(req.params.id);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${campground._id}`);
} ))

app.get("/campgrounds/:id/edit", catchAsync( async (req, res,next)=>{
    const {id} = req.params;
    const campground =await Campground.findById(id);
    res.render("campgrounds/edit", {campground} )
}));

app.put("/campgrounds/:id", validateCampground, catchAsync( async (req, res,next)=>{
    const {id} = req.params;
    // req.body = {campground: {title:{...} ,location: {...}   }   }
    const updateCamp = await Campground.findByIdAndUpdate(id, {...req.body.campground}); 
    await updateCamp.save();
    res.redirect(`/campgrounds/${updateCamp._id}`);
}));

app.delete("/campgrounds/:id", catchAsync( async (req, res,next)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds")
}));

app.get("/campgrounds/:id", catchAsync( async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", {campground});

}));

app.all("*", (req,res,next)=>{
    next(new ExpressError("Page Not Found", 404))
})

app.use((err,req,res,next)=>{
    const {status = 500} = err;
    if(!err.message){
        err.message = "something went wrong!"
    }
    res.render("error", { err })
})

app.listen("3000",()=>{
    console.log("Listening to the port 3000!");
});
