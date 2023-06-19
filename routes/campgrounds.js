const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require('../models/campground');
const methodOverride = require("method-override");
const {campgroundSchema, reviewSchema} = require("../schema");
const {isLoggedIn, isAuthor, validateCampground} = require("../middleware");
const campground = require("../controllers/campground")

router.get("/", catchAsync(campground.index));

router.get("/new",isLoggedIn, campground.renderNewForm);

router.post("/", isLoggedIn, validateCampground, catchAsync(campground.createCampground));

router.get("/:id/edit", isLoggedIn ,isAuthor, catchAsync(campground.renderEditForm ));

router.put("/:id",isLoggedIn, isAuthor, validateCampground, catchAsync(campground.updateCampground));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));

router.get("/:id",  catchAsync(campground.showCampground));

module.exports = router;