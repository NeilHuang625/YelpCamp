const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require('../models/campground');
const methodOverride = require("method-override");
const {campgroundSchema, reviewSchema} = require("../schema");
const {isLoggedIn, isAuthor, validateCampground} = require("../middleware");
const campground = require("../controllers/campground")

router.route("/")
        .get(catchAsync(campground.index))
        .post(isLoggedIn, validateCampground, catchAsync(campground.createCampground))

router.get("/new",isLoggedIn, campground.renderNewForm);

router.get("/:id/edit", isLoggedIn ,isAuthor, catchAsync(campground.renderEditForm ));

router.route("/:id")
        .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campground.updateCampground))
        .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))
        .get(catchAsync(campground.showCampground))

module.exports = router;