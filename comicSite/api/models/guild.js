const mongoose = require('mongoose');

const RatingScema = mongoose.Schema({
    user: {
        type: Number,
        required: true
    }, rating: {
        type: Number,
        required: true
    }
},{ _id : false });

const GuildSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    }, name: {
        type: String,
        required: true
    }, leader: {
        type: Number,
        required: true
    }, mods:
        [Number] // userIds
    ,  members:
        [Number]
    , description: {
        type: String
    }, links: 
        [String]
    , followers: 
        [Number]
    , uploadPermissions: {
        type: Number,
        default: 0
    }, chapters: 
        [String]
    , comments:
        [String]
    , series:
        [Number]
    , ratings: 
        [RatingScema]
    , logoPic: {
        type: String
        //default: ./images/defaultPic
    }             
});

module.exports = mongoose.model('Guild', GuildSchema, 'Guilds');
