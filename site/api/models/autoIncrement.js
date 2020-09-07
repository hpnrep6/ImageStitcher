const mongoose = require('mongoose');

const incrementSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
    }, counter: {
        type: Number,
        default: 1 // 0 will return false in checking if counter is returned
    }    
}, {
    versionKey: false
});

module.exports = mongoose.model('Increment', incrementSchema, 'IncrementCounter');