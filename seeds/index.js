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

const sample = a=>a[Math.floor(Math.random()*a.length)];


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
    
    for(let i =0; i <40; i++){
        const price = Math.floor(Math.random()*20 )+10;
        const camp = new Campground({
            location:`${sample(cities).city}, ${sample(cities).state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: await getImg(),
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