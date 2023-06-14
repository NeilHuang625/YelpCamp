const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const CampgroundSchema = new Schema({
    image:String,
    title: String,
    price: Number,
    description: String,
    location: String,
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
});

CampgroundSchema.post("findOneAndDelete", async (doc)=>{
    if(doc.reviews.length){
        console.log("have review!")
        await Review.deleteMany({_id: {$in : doc.reviews} })
    }else{
        console.log("No reviews! delete directly");
    }
})

module.exports = mongoose.model("Campground" , CampgroundSchema);
