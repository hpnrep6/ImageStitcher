const express = require('express');
const htmlsanitise = require('../libs/htmlsanitise');
const mongoose = require('mongoose');
const increment = require('../libs/increment');
const comicSchema = require('../models/series');

const router = express.Router();

// Middleware to find a series in the :id paramater in url
async function findSeries(req, res, next) {
    // Tries to parse url paramater :id as integer
    try{
        var id = parseInt(req.params.id);
    } catch(error) {
        res.status(500).json({message: 'Server error'});
        console.log(error)
        return;
    }   

    // Finding series
    await comicSchema.findById(id, (err, series) => {
        if(err) {
            res.status(500).json({message: 'Server error'});
            return;
        }

        if(!series) {
            res.status(404).json({message: 'Series not found'});
            return;
        }
        
        // Stores series object 
        req.foundSeries = series;
        next();
    });   
}

router.get('/:id', async (req, res) => {
    try{
        // Get integer part of id and find in mongodb database
        let idInInteger = parseInt(id);

        let series = await comicSchema.findById(idInInteger);
        
        res.status(200).json({
            id: series._id,
            description: series.description
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
        return;
    }
});

// TEST FILE UPLOAD
router.post('/update/cover/:id', findSeries, async (req, res) => {
    try{
        foundSeries = req.foundSeries;
    } catch(error) {
        res.status(500).json({message: 'Server error'});
        console.log(error)
        return;
    }
});


router.post('/update/:id', findSeries, async (req, res) => {
    try{
        var foundSeries = req.foundSeries;
        
        // Verifying input fields
        if(!(
            req.body.name &&
            req.body.description &&
            req.body.language &&
            req.body.creators &&
            req.body.tags &&
            req.body.status
        )) {
            return res.status(400).json({message: "Invalid"});
        }

        var desc = req.body.description.toString();
        var lang = req.body.language.toString();
        var stat = req.body.status.toString();

        if(
        desc.length < 1 || desc.length > 3000 ||
        lang.length != 2|| stat.length > 10) {
            return res.status(400).json({message: "Invalid"});
        }

        // Sanitising input fields
        desc = htmlsanitise(desc);
        lang = htmlsanitise(lang);
        stat = htmlsanitise(stat);

        if(!(Array.isArray(req.body.tags) && Array.isArray(req.body.creators) && Array.isArray(req.body.name))) {
            res.status(400).json({message: 'Invalid'});
            return;
        }

        if(req.body.tags.length > 128 || req.body.creators.length > 64 || req.body.name.length > 64) {
            res.status(400).json({message: 'Invalid'});
            return;
        }

        let tagsArray = Object.values(req.body.tags);
        let nameArray = Object.values(req.body.name);
        let creatorsArray = Object.values(req.body.creators);

        // Sanitises and checks elements that are arrays
        for(var i = 0, n = tagsArray.length; i < n; i++) {
            if(tagsArray[i].name.length < 200) {
                tagsArray[i].name = htmlsanitise(tagsArray[i].name.toString());
            } else {
                res.status(400).json({message: 'Invalid'});
                return;
            }    
        };

        for(var i = 0, n = nameArray.length; i < n; i++) {
            if(nameArray[i].length < 250 ) {
                nameArray[i] = htmlsanitise(nameArray[i].toString());
            } else {
                res.status(400).json({message: 'Invalid'});
                return;
            }    
        };

        for(var i = 0, n = creatorsArray.length; i < n; i++) {
            if(creatorsArray[i].length < 200) {
                creatorsArray[i] = htmlsanitise(creatorsArray[i].toString());
            } else {
                res.status(400).json({message: 'Invalid'});
                return;
            }    
        };

        foundSeries.name = nameArray;
        foundSeries.description = desc;
        foundSeries.language = lang;
        foundSeries.status = stat;
        foundSeries.tags = tagsArray;
        foundSeries.creators = creatorsArray;

        await foundSeries.save();

        // TODO: REDIRECT TO COMIC PAGE
        res.status(200).json({
            message: 'Successfully updated'
        });
    } catch(error) {
        res.status(500).json({message: 'Server error'});
        console.log(error)
        return;
    }
});

// TODO: ADD AUTH TO /add PATH
router.post('/add', async (req, res) => {
    try{
        var foundSeries = new comicSchema();
        if(!(
            req.body.name &&
            req.body.description &&
            req.body.language &&
            req.body.creators &&
            req.body.tags &&
            req.body.status
        )) {
            return res.status(400).json({message: "Invalid"});
        }

        var desc = req.body.description.toString();
        var lang = req.body.language.toString();
        var stat = req.body.status.toString();

        if(
        desc.length < 1 || desc.length > 3000 ||
        lang.length != 2|| stat.length > 10) {
            return res.status(400).json({message: "Invalid"});
        }

        // Sanitising input fields
        desc = htmlsanitise(desc);
        lang = htmlsanitise(lang);
        stat = htmlsanitise(stat);

        if(!(Array.isArray(req.body.tags) && Array.isArray(req.body.creators) && Array.isArray(req.body.name))) {
            res.status(400).json({message: 'Invalid'});
            return;
        }

        if(req.body.tags.length > 128 || req.body.creators.length > 64 || req.body.name.length > 64) {
            res.status(400).json({message: 'Invalid'});
            return;
        }

        let tagsArray = Object.values(req.body.tags);
        let nameArray = Object.values(req.body.name);
        let creatorsArray = Object.values(req.body.creators);

        // Sanitises and checks elements that are arrays
        for(var i = 0, n = tagsArray.length; i < n; i++) {
            if(tagsArray[i].name.length < 200) {
                tagsArray[i].name = htmlsanitise(tagsArray[i].name.toString());
            } else {
                res.status(400).json({message: 'Invalid'});
                return;
            }    
        };

        for(var i = 0, n = nameArray.length; i < n; i++) {
            if(nameArray[i].length < 250 ) {
                nameArray[i] = htmlsanitise(nameArray[i].toString());
            } else {
                res.status(400).json({message: 'Invalid'});
                return;
            }    
        };

        for(var i = 0, n = creatorsArray.length; i < n; i++) {
            if(creatorsArray[i].length < 200) {
                creatorsArray[i] = htmlsanitise(creatorsArray[i].toString());
            } else {
                res.status(400).json({message: 'Invalid'});
                return;
            }    
        };

        // ADD LANGAUGE ETC TO TAGS ARRAY

        foundSeries.name = nameArray;
        foundSeries.description = desc;
        foundSeries.language = lang;
        foundSeries.status = stat;
        foundSeries.tags = tagsArray;
        foundSeries.creators = creatorsArray;

        
        increment.getAndIncrement('series').then(counter => {
            if(!counter) {
                res.status(500).json({message: 'Server error'});
                return;
            }
            foundSeries._id = counter;

            // TODO: REDIRECT TO COMIC PAGE
            foundSeries.save().then(result => {
                res.status(200).json({
                message: 'Series successfully added.',
                id: counter });
            }).catch(error => {
                console.log(error);
                res.status(500).json({message: 'Server error'});
                return;
            });
        });
    } catch(error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
    
});

module.exports = router;
