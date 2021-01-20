const campground = require('../models/campground');
const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds: campgrounds})
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    // populate the reviews, and then populate the author of that review
    .populate({
        path: 'reviews',
        populate: {
            path:'author'
        }
    })
    // populate the campground author
    .populate('author');
    if(!campground){
        req.flash('error','Cannot find that campground.');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground: campground});
}

module.exports.renderEditForm = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error','Cannot find that campground.');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground: campground});
}

module.exports.updateCampground = async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    // We want to delete the images in campground.images that are also in the array req.body.deleteImages
    if(req.body.deleteImages){
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');  
}