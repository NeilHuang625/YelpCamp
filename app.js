const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate")
const mongoose = require("mongoose");
const Campground = require('./models/campground');
const methodOverride = require("method-override")


mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;

db.on('error', err => {
    logError(err);
  });
db.once("open", ()=>{
    console.log("Connected to the database!");
})

app.engine("ejs", ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/",(req,res)=>{
    res.send("Hello It work!");
});

app.get("/campgrounds", async (req, res)=>{
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
})

app.get("/campgrounds/new", (req, res)=>{
    res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res)=>{
    const {campground} = req.body;      // same as: const campground = req.body.campground;
    const newCamp = await new Campground(campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
});

app.get("/campgrounds/:id/edit", async (req, res)=>{
    const {id} = req.params;
    const campground =await Campground.findById(id);
    res.render("campgrounds/edit", {campground} )
})

app.put("/campgrounds/:id",async (req, res)=>{
    const {id} = req.params;
    // req.body = {campground: {title:{...} ,location: {...}   }   }
    const updateCamp = await Campground.findByIdAndUpdate(id, {...req.body.campground}); 
    await updateCamp.save();
    res.redirect(`/campgrounds/${updateCamp._id}`);
})

app.delete("/campgrounds/:id", async (req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds")
})

app.get("/campgrounds/:id", async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", {campground});

});

app.listen("3000",()=>{
    console.log("Listening to the port 3000!");
});