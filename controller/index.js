// Import Libraries
const express = require('express');

const router = express.Router();

/**
 * Return Form page for Login
 */
router.get('/', function (req, res) {
    res.json({'index': 'Index Page'});
});

module.exports = router;
