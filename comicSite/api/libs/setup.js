const mongoose = require('mongoose');
const autoIncrement = require('../models/autoIncrement');
const languageSchema = require('../models/language');

function setup() {
    initialiseAutoIncrement('user');
    initialiseAutoIncrement('series');
    initialiseAutoIncrement('chapter');
    initialiseAutoIncrement('guild');
    initialiseAutoIncrement('thread');
    initialiseAutoIncrement('uploads');
    initialiseLanguages();
}

async function initialiseAutoIncrement(name) {
    await autoIncrement.exists({
        _id: name
    }, (err, result) => {
        if(err) {
            console.log('Error');
            console.log(err);
            return;
        }
        if(result) {
            console.log(name + ' increment counter already exists, continuing...');
            return;
        }
        // else, create increment counter
        const userIncrement = new autoIncrement ({
            _id: name
        });
        userIncrement.save().then(result => {
            console.log(name + ' increment counter created');
        }).catch(error => {
            console.log('Error creating ' + name + ' increment counter: ');
            console.log(error);
        });
    });
};

const languageArray = [
    {_id: 'jp'}, // Japanese
    {_id: 'en'}, // English
    {_id: 'cn'}, // Chinese Simplified
    {_id: 'tw'}, // Chinese Traditional
    {_id: 'pl'}, // Polish
    {_id: 'ru'}, // Russian
    {_id: 'fr'}, // French
    {_id: 'qb'}, // Quebec French
    {_id: 'vn'}, // Vietnamese
    {_id: 'de'}, // German
    {_id: 'id'}, // Indonesian
    {_id: 'kr'}, // Rep of Korea
    {_id: 'kp'}, // Dem Rep of Korea
    {_id: 'es'}, // Spanish
    {_id: 'th'}, // Thai
    {_id: 'ph'}, // Filipino
    {_id: 'hi'}, // Hindi
    {_id: 'ar'}, // Arabic
    {_id: 'pt'}, // Portugese
    {_id: 'jv'}, // Javanese
    {_id: 'la'}, // Latin
    {_id: 'ua'}, // Ukrainian
    {_id: 'fi'}, // Finnish
    {_id: 'kg'}, // Klingon
    {_id: 'ud'}  // Urdu
];

async function initialiseLanguages() {
    console.log('Creating langauge documents...');
        languageArray.forEach((i) => {
            languageSchema.findOneAndUpdate(i, i, {new: true, upsert: true}, (err, doc) => {
                if(err) {
                    console.log('ERROR: Error creating language documents');
                    console.log(err);
                    return;
                }
            });
        });
};

module.exports = setup;