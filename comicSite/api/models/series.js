const mongoose = require('mongoose');

const RatingSchema = mongoose.Schema({
    user: {
        type: Number,
        required: true
    }, rating: {
        type: Number,
        required: true
    }
},{ _id : false });

const TagSchema = mongoose.Schema({
    category: {
        type: String,
        enum: [
            'Language',
            'Creator',
            'Tag'
        ],
        required: true
    }, name: {
        type: String,
        maxlength: 250,
        required: true
    }
},{ _id : false });

const SeriesSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    }, name: {
        type: [{
            type: String,
            maxlength: 250,
            minlength: 1
        }],
        required: true,
        index: true
    }, creators: { 
        type: [{
            type: String,
            maxlength: 200,
            minlength: 1
        }],
        index: true
    }, tags: { 
        type: [TagSchema],
        index: true
    }, description: {
        type: String,
        required: true,
        maxlength: 3000
    }, lastUpdate: {
        type: Date,
        default: Date.now
    }, coverImage: {
        type: String,
        //default: path to defaultCoverImage
    }, chapters: 
        [String] // chapterIDs
    , language: {
        type: String,
        required: true,
        index: true,
        maxlength: 2
    }, views: {
        type: Number,
        default: 0
    }, follows: {
        type: Number,
        default: 0
    }, ratings:
        [RatingSchema]
    , links:
        [String]
    , status: {
        type: String,
        enum: [
            'Ongoing',
            'Hiatus',
            'Cancelled',
            'Finished',
            'Unreleased'
        ]
    }
});

module.exports = mongoose.model('Series', SeriesSchema, 'Series');
