const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');

function verify(req, res, next) {
    try{
        let token = jwt.verify(req.body.token, process.env.JWT_KEY);
        req.decoded = token;
        next();
    } catch (err) {
        res.status(401).json({
            message: 'Authorisation failed'
        });
    }
}

module.exports = verify;