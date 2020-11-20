// Import Libraries
const express = require('express');
const bodyParser = require('body-parser');
const httpStatusCodes = require('http-status-codes');
const StatusCodes = httpStatusCodes.StatusCodes;

const UserDB = require('../dbutils/UserDB');
const User = require("../model/User");
const uuid4 = require("uuid4");

const urlencodedParser = bodyParser.urlencoded({extended: true});

const userDB = new UserDB();
const router = express.Router();

router.use(urlencodedParser);

router.post('/login', function (req, res) {
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

router.post('/register', function (req, res) {
    const params = req.body;

    const emailId = params.emailId
    const password = params.password
    const firstName = params.firstName
    const lastName = params.lastName

    let user = new User(uuid4(), firstName, lastName, emailId, password, uuid4());
    userDB.addUser(user, function (isInserted, message) {
        if (isInserted) {
            res.status(StatusCodes.OK)
            res.json({
                'status': StatusCodes.CREATED
            });
        } else {
            res.status(StatusCodes.FORBIDDEN)
            res.json({
                'status': StatusCodes.FORBIDDEN,
                'data': {
                    'message': 'Registration Failed. ' + message
                }
            });
        }
    });
});

module.exports = router;
