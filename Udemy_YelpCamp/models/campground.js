const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")
const {cloudinary} = require("../cloudinary")

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    images:[
        {
            url:String,
            filename:String
        }
    ],
    title: String,
    location: String,
    price: Number,
    description: String,
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
}, opts);

CampgroundSchema.virtual("properties.popUpMarkUp").get(function(){
    return `
        <strong><a href="/campgrounds/${this._id}" >${this.title}</a></strong>
        <p>${this.description.substring(0,20)}...</p>
    `
})

CampgroundSchema.post("findOneAndDelete", async (doc)=>{
    if(doc.reviews.length){
        await Review.deleteMany({_id: {$in : doc.reviews} })
    }
    //delete cloudinary pics associated with this campground
    for(let img of doc.images ){
        cloudinary.uploader.destroy(img.filename);
    }
})

CampgroundSchema.path('images').schema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload/', '/upload/w_300/');
});

module.exports = mongoose.model("Campground" , CampgroundSchema);
