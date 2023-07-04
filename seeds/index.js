const mongoose = require("mongoose");
// const cities = require("./cities");
const cities = require("./nz")
const axios = require("axios");
const {descriptors, places} = require("./seedHelpers");
const Campground = require("../models/campground");

const dbUrl = process.env.DB_URL ;
// || "mongodb://127.0.0.1:27017/yelp-camp" 
mongoose.connect("mongodb+srv://neiltang618:jt2Mz7NXw52iREjJ@yelpcamp.pa8vckl.mongodb.net/?retryWrites=true&w=majority");
const db = mongoose.connection;

db.on('error', err => {
    console.log(err);
  });
db.once("open", ()=>{
    console.log("Database connected!");
})

const seedDB = async ()=>{
    await Campground.deleteMany({});
    
    for(let i =0; i <150; i++){
        const price = Math.floor(Math.random()*20 )+10;
        const sample = a=>a[Math.floor(Math.random()*a.length)];
        const random99 = Math.floor(Math.random()*99);
        const camp = new Campground({
            author:"648ee386f4404d5c732f666e",
            location:`${cities[random99].city}, ${cities[random99].admin_name}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry:{
                type:"Point",
                coordinates:[ 
                    cities[random99].lng,
                    cities[random99].lat
                 ]
            },
            images: [
                    {
                    url: "https://res.cloudinary.com/dk2dphyqw/image/upload/v1687309358/YelpCamp/rrpkxlvkghz7vcnfnayq.jpg",
                    filename: 'YelpCamp/giimqxxiqzqynnt1j3kq'
                    },
                    {
                    url: "https://res.cloudinary.com/dk2dphyqw/image/upload/v1687335762/YelpCamp/gosyerxa4ier307m0u85.jpg",
                    filename: 'YelpCamp/wjvu2styta4uzoii8uct'
                    }
                    ],
            description:"Lorem ipoluptatumfdsafdsafsafdsfdsa corrudadsafdspti numquam beatae reiciendis. Ducimus numquam atque quam accusantium perspiciatis reiciendis dolor! Nulla expedita possimus reiciendis voluptatum? Eligendi provident ut in illum possimus?",
            price:price
        })

        await camp.save();
    }
}

seedDB()
.then(()=>{
    mongoose.connection.close();
})