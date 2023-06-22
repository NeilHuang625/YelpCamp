const Campground = require("../models/campground");
const {cloudinary} = require("../cloudinary/index")

module.exports.index =  async (req, res, next)=>{
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}

module.exports.renderNewForm = (req, res)=>{
    res.render("campgrounds/new");
}

module.exports.createCampground = async (req, res,next)=>{
    const {campground} = req.body;      // same as: const campground = req.body.campground;
    const newCamp = await new Campground(campground);
    newCamp.images = req.files.map(f => ({ url:f.path, filename: f.filename }))
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash("success", "New Campground Added");
    res.redirect(`/campgrounds/${newCamp._id}`);
}

module.exports.showCampground =  async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path:"reviews",
        populate:{path:"author"}
    }).populate("author");
    if(!campground){
        req.flash("error", "Can't find the page!");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", {campground});
}

module.exports.renderEditForm = async (req, res,next)=>{
    const {id} = req.params;
    const campground =await Campground.findById(id);
    
    res.render("campgrounds/edit", {campground} )
}

module.exports.updateCampground =  async (req, res,next)=>{
    const {id} = req.params;
    // req.body = {campground: {title:{...} ,location: {...}   }   }
    const updateCamp = await Campground.findByIdAndUpdate(id, {...req.body.campground}); 
    const imgs = req.files.map(f => ({ url:f.path, filename: f.filename }))
    updateCamp.images.push(...imgs);
    await updateCamp.save();
    if(req.body.imageDelete){
        for(let filename of req.body.imageDelete){
            await cloudinary.uploader.destroy(filename);
        }
        await updateCamp.updateOne({$pull:{images:{filename:{$in: req.body.imageDelete}}}});
    }
    req.flash("success", "Successfully updated !")
    res.redirect(`/campgrounds/${updateCamp._id}`);
}

module.exports.deleteCampground = async (req, res,next)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success"," Campground Deleted!")
    res.redirect("/campgrounds")
}