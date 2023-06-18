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
const passport = require("passport");
const LocalStratege = require("passport-local");
const User = require("./models/user")


const campgroundRoute = require("./routes/campgrounds")
const reviewRoute = require("./routes/reviews")
const userRoute = require("./routes/user")


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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratege(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/fakeUser", async (req, res, next)=>{
    const user = new User({
        email: "neil@gmail.com",
        username:"neillll"
    });

    const fakeUser =await User.register(user, "chicken");
    res.send(fakeUser)
})

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/review", reviewRoute);
app.use("/", userRoute);




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
