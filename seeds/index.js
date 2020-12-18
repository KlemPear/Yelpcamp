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
    await User.deleteMany({});

    for (let index = 0; index < 50; index++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '5fd9a4be206d820d4d465380',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/800x600/?nature,hiking,mountains',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil fuga placeat aperiam, quo reiciendis facere. Esse ipsam inventore beatae modi aliquam. A incidunt maxime placeat nam iste aperiam mollitia animi.',
            price: price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

