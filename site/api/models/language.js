const mongoose = require('mongoose');

const languageSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },icon: {
        type: String
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Language', languageSchema, 'Languages');