const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")
const {cloudinary} = require("../cloudinary")

const CampgroundSchema = new Schema({
    images:[
        {
            url:String,
            filename:String
        }
    ],
    title: String,
    price: Number,
    description: String,
    location: String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
});

CampgroundSchema.post("findOneAndDelete", async (doc)=>{
    if(doc.reviews.length){
        await Review.deleteMany({_id: {$in : doc.reviews} })
    }
    //delete cloudinary pics associated with this campground
    for(let img of doc.images ){
        cloudinary.uploader.destroy(img.filename);
    }
})

module.exports = mongoose.model("Campground" , CampgroundSchema);
