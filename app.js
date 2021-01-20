if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path =  require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
// const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// sudo mongod --dbpath=/home/clem/Git/YelpCamp/data/db
// mongo | use yelp-camp | db.campgrounds.find()
// npx nodemon app.js

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use(morgan('tiny'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
// ask express to serve our public directory
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisShouldBeASecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

//Set up passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render("home")
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('ERROR 404: PAGE NOT FOUND.', 404));
})

function handleMongooseError(err, errorType) {
    return new ExpressError(`${errorType} Failed...${err.message}`,400);
}

app.use((err,req,res,next) => {
    if(err.name === 'ValidationError') err = handleMongooseError(err, 'Form Validation')
    if(err.name === 'CastError') err = handleMongooseError(err, 'Cast')
    if(!err.message) err.message = 'Something went wrong...';
    const {status = 500} = err;
    res.status(status).render('error', {err: err});
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
 