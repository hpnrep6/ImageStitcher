const mongoose = require('mongoose');
const incrementSchema = require('../models/autoIncrement');

// increments counter by 1, and returns the counter before it was incremented
async function increment(name) {

    var doc = await incrementSchema.findByIdAndUpdate(
    name, {$inc: {counter: 1}});

    return doc.counter;
}

module.exports.getAndIncrement = increment;