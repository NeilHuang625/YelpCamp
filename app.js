const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate")
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const session = require("express-session");
const flash = require("connect-flash");


const campgrounds = require("./routes/campgrounds")
const reviews = require("./routes/reviews")


mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;

db.on("error", err => {
    logError(err);
  });
db.once("open", ()=>{
    console.log("Connected to the database! aha!");
})

app.engine("ejs", ejsMate);

const sessionConfig  = {
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        maxAge: 1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "/public")));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    next();
})
app.use((req, res, next)=>{
    res.locals.error = req.flash("error");
    next();
})

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/review", reviews)



app.get("/",(req,res)=>{
    res.send("Hello It work!");
});



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
