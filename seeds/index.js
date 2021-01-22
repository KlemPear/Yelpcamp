const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    await Review.deleteMany({});

    for (let index = 0; index < 150; index++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '5fdc3c17d4d37142f742d1eb',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil fuga placeat aperiam, quo reiciendis facere. Esse ipsam inventore beatae modi aliquam. A incidunt maxime placeat nam iste aperiam mollitia animi.',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
                },
            images:[ 
                { 
                    url:'https://res.cloudinary.com/klempear/image/upload/v1608267983/YelpCamp/rtiie8s1lwbpnajhgsep.jpg',
                    filename: 'YelpCamp/rtiie8s1lwbpnajhgsep' 
                },
                { 
                    url:'https://res.cloudinary.com/klempear/image/upload/v1608267986/YelpCamp/bwvzxe2u5m8odoz0kven.jpg',
                    filename: 'YelpCamp/bwvzxe2u5m8odoz0kven' 
                },
                {
                    url:'https://res.cloudinary.com/klempear/image/upload/v1608267992/YelpCamp/rtfwlncz2zbb9xydbljm.jpg',
                    filename: 'YelpCamp/rtfwlncz2zbb9xydbljm' 
                } 
            ]
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

