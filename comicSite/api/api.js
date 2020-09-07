const express = require('express');
const router = express.Router();
const app = require('../app');
const fs = require('fs');

// Handling /api
router.get('/', (req, res) => {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Invalid API endpoint.');
    res.end();
});

// Handling /api/~
const chapterRoute = require('./routes/chapters');
router.get('/', () => {}).use('/chapters', chapterRoute);

const comicRoute = require('./routes/series');
router.get('/', () => {}).use('/series', comicRoute);

const commentRoute = require('./routes/comments');
router.get('/', () => {}).use('/comments', commentRoute);

const guildRoute = require('./routes/guilds');
router.get('/', () => {}).use('/guilds', guildRoute);

const threadRoute = require('./routes/threads');
router.get('/', () => {}).use('/threads', threadRoute);

const userRoute = require('./routes/users');
router.get('/', () => {}).use('/users', userRoute);

module.exports = router;