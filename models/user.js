const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
UserSchema.plugin(passportLocalMongoose); // adds on user name a password to model
// see doc for Passport-local-mongoose on Github
module.exports =  mongoose.model('User', UserSchema);