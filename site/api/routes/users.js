const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const increment = require('../libs/increment');
const authorise = require('../libs/authorise');

const userSchema = require('../models/user');

const router = express.Router();


router.get('/:id', async (req, res) => {
    try{
        // UserID
        var uid = req.params.id.toString();

        if(uid.length >= 16) {
            res.status(400).json({message: 'Invalid'});
            return;
        }   
        
        // Get integer part of id and find in mongodb database
        let idInInteger = parseInt(uid);

        let user = await userSchema.findById(idInInteger);
        
        res.status(200).json({
            id: user._id,
            username: user.username,
            profilePic: user.profilePic,
            joinDate: user.joinDate,
            description: user.description,
            guilds: user.guilds,
            chapters: user.chapters
        });
        return;

    } catch(error) {
        res.status(500).json({message: 'Server error'});
        console.log(error)
        return;
    }    
});

const userRegex = /^[a-zA-Z0-9_-]+$/;

router.post('/login', async (req, res) => {
    try{
        // Using same check as register route to ensure username and email is valid before searching 
        // for it in the database

        // Checking if required JSON object exists
        if(!(req.body.password && req.body.email)) {
            res.status(401).json({message: 'Login invalid'});
            return;
        }
        
        var email = req.body.email.toString();
        var password = req.body.password.toString();

        // Checks length of email
        if(email.length >= 256) {
            res.status(401).json({message: 'Login invalid'});
            return;
        }
        // Preliminary email check 
        if(!(email.indexOf('.') != -1 && email.indexOf('@') != -1 && email.indexOf('$') == -1)) {
            res.status(401).json({message: 'Login invalid'});
            return;
        }

        // Check password length
        if(password.length < 8 || password.length >= 128) {
            res.status(401).json({message: 'Login invalid'});
            return;
        }

        await userSchema.findOne({email: email}, (err, user) => {
            if(err) {
                res.status(500).json({message: 'Server error'});
                return;
            }

            if(!user) {
                res.status(401).json({message: 'Login invalid'});
                return;
            }

            bcrypt.compare(password, user.password, (error, response) => {
                if(error) {
                    res.status(500).json({message: 'Server error'});
                    console.log(error)
                    return;
                } else if(response) {
                    const token = jwt.sign({
                        uid: user._id,
                        email: user.email
                    }, process.env.JWT_KEY
                    , {
                        expiresIn: "1d"
                    });

                    res.status(200).json({message: 'Login valid', token: token});
                    return;
                } else {
                    res.status(401).json({message: 'Login invalid'});
                    return;
                }
            });
        });
    }  catch(error) {
        res.status(500).json({message: 'Server error'});
        console.log(error)
        return;
    }    
});

router.post('/register', async (req, res) => {
    try{
        // Checking if required JSON object exists
        if(!(req.body.username && req.body.password && req.body.email)) {
            res.status(400).json({message: 'Invalid'});
            return;
        }
        
        var email = req.body.email.toString();
        var username = req.body.username.toString();
        var password = req.body.password.toString();

        // Checks length of email
        if(email.length >= 256) {
            res.status(400).json({message: 'Invalid'});
            return;
        }
        // Preliminary email check 
        if(!(email.indexOf('.') != -1 && email.indexOf('@') != -1 && email.indexOf('$') == -1)) {
            res.status(400).json({message: 'Invalid'});
            return;
        }

        // Check password length
        if(password.length < 8 || password.length >= 128) {
            res.status(400).json({message: 'Invalid'});
            return;
        }

        // Check username length
        if(username.length <= 2 || username.length > 64) {
            res.status(400).json({message: 'Invalid'});
            return;
        }

        // Check username characters; only allows alphanumerics, -, and _
        if(!userRegex.test(username)) {
            res.status(400).json({message: 'Invalid'});
            return;
        }

        // Checks if username or email already in database
        let userExists = await userSchema.exists({username: username});
        if(userExists) {
            res.status(400).json({message: 'User Exists'});
            return;
        }
        let emailExists = await userSchema.exists({email: email});
        if(emailExists) {
            res.status(400).json({message: 'Email Exists'});
            return;
        }

        // Encrypting password
        const hashed = await bcrypt.hash(password, 7, (err, hash) => {
            if(err) {
                res.status(500).json({message: 'Error'});
                return;
            }

            // Getting increment count for users
            increment.getAndIncrement('user').then(counter => {
                if(!counter) {
                    res.status(500).json({message: 'Server error'});
                    return;
                }

                // Saving user
                const user = new userSchema({
                    _id: counter,
                    username: username,
                    email: email,
                    password: hash
                });

                user.save().then(result => {
                    res.status(200).json( { message: 'User successfully registered.'});
                }).catch(error => {
                    console.log(error);
                    res.status(500).json({message: 'Server error'});
                    return;
                })
            }).catch(error => {
                res.status(500).json({message: 'Server error'});
                return;
            });
        });
    } catch(error) {
        res.status(500).json({message: 'Server error'});
        console.log(error)
        return;
    }    

    // ESCAPE HTML INJECTION 

    // CLIENT SIDE REPLACE ESCAPE VAR \ WITH \\
    // CHECK IF USER ALREADY EXISTS
});

module.exports = router;