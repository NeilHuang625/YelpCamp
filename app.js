if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

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
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");

const MongoStore = require("connect-mongo");

const campgroundRoute = require("./routes/campgrounds")
const reviewRoute = require("./routes/reviews")
const userRoute = require("./routes/user")
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp" 
mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("error", err => {
    console.log(err);
  });
db.once("open", ()=>{
    console.log("Connected to the database! aha!");
})

app.engine("ejs", ejsMate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret'
    }
});

store.on("error", function(e){
    console.log("Mongo Store error",e)
})

const sessionConfig  = {
    store,
    name:"session",
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        maxAge: 1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.cloudinary_cloud_name}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "/public")));
app.use(mongoSanitize());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratege(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

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
    res.render("home.ejs");
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
