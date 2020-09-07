const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true,
        index: true
    }, email: {
        type: String,
        required: true,
        index: true
    }, password: {
        type: String,
        required: true
    }, verifiedEmail: {
        type: Boolean,
        default: false
    }, profilePic: {
        type: String // default: Path to image in ./images/uploads
    }, description: {
        type: String,
        default: ''
    }, joinDate: {
        type: Date,
        default: Date.now
    }, guilds: 
        [String] // guildID hex
    , chapters: 
        [String] // chapterID hex
    , follows: 
        [String] // seriesID hex
    , permissions: {
        type: Number, // permissionID int
        default: 100
    }, revision: {
        type: Number, // Used to keep track of password changes 
        required: true,
        default: 1
    }
});

module.exports = mongoose.model('User', UserSchema, 'Users');
