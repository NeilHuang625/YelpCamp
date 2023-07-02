const mongoose = require("mongoose");
const cities = require("./cities");
const axios = require("axios");
const {descriptors, places} = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
const db = mongoose.connection;

db.on('error', err => {
    logError(err);
  });
db.once("open", ()=>{
    console.log("Database connected!");
})

async function getImg(){ 
    try{
    const res = await axios.get("https://api.unsplash.com/photos/random", {
        params: {
          client_id: '64PajU-HObbdhVZyWoCijczgcyMYGGB9mwHlHjikKrw',
          collections: 1114848
        }
      });
    const url = res.data.urls.regular;
    return url;
    }catch(e){
        console.log(e)
    }
};

const seedDB = async ()=>{
    await Campground.deleteMany({});
    
    for(let i =0; i <300; i++){
        const price = Math.floor(Math.random()*20 )+10;
        const sample = a=>a[Math.floor(Math.random()*a.length)];
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
            author:"648ee386f4404d5c732f666e",
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry:{
                type:"Point",
                coordinates:[ 
                    cities[random1000].longitude,
                    cities[random1000].latitude
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