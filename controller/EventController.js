// Import Libraries
const express = require('express');
const bodyParser = require('body-parser');
const httpStatusCodes = require('http-status-codes');
const StatusCodes = httpStatusCodes.StatusCodes;

const UserDB = require('../dbutils/UserDB');
const EventDB = require('../dbutils/EventDB');
const User = require("../model/User");
const uuid4 = require("uuid4");

const urlencodedParser = bodyParser.urlencoded({extended: true});

const userDB = new UserDB();
const eventDB = new EventDB();
const router = express.Router();

router.use(urlencodedParser);

// Return list of all events
router.get('/event', function (req, res) {
    const param = req.body;
    const authToken = param.authToken;

    userDB.getUserFromToken(authToken, function (foundUser) {
        if (foundUser == null) {
            res.status(StatusCodes.UNAUTHORIZED)
            res.json({
                'status': StatusCodes.UNAUTHORIZED,
                'data': {
                    'message': 'User Unauthorized'
                }
            })
        } else {
            // Get all events without group

        }
    })
});

// Create New Event
router.post('/event', function (req, res) {
    const params = req.body;
    const emailId = params.emailId
    const password = params.password

    userDB.isValidUser(emailId, password, function (isAuthenticated, authToken, message) {
        let statusCode = StatusCodes.UNAUTHORIZED;
        if (isAuthenticated) {
            statusCode = StatusCodes.OK;
        }
        res.status(statusCode)
        res.json({
            'status': statusCode,
            'data': {
                'auth_token': authToken,
                'message': message
            }
        });
    });
});

module.exports = router;
