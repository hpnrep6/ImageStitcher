const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json( {
        message: 'asd'
    });
});

router.post('/', (req, res) => {
    res.status(200).json( {
        message: 'post'
    });
});

module.exports = router;