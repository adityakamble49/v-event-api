// Import Libraries
const express = require('express');
const bodyParser = require('body-parser');
const httpStatusCodes = require('http-status-codes');
const StatusCodes = httpStatusCodes.StatusCodes;

const UserDB = require('../dbutils/UserDB');
const MeetupGroupDB = require('../dbutils/MeetupGroupDB');
const MeetupGroup = require("../model/MeetupGroup");
const uuid4 = require("uuid4");

const urlencodedParser = bodyParser.urlencoded({extended: true});

const userDB = new UserDB();
const meetupGroupDB = new MeetupGroupDB();
const router = express.Router();

router.use(urlencodedParser);

router.get('/', function (req, res) {
    const param = req.query;
    const headers = req.headers;

    const authToken = headers.authorization;
    const groupId = param.groupId;

    userDB.getUserFromToken(authToken, function (foundUser) {
            if (foundUser == null) {
                res.status(StatusCodes.UNAUTHORIZED);
                res.json({
                    'status': StatusCodes.UNAUTHORIZED,
                    'data': {
                        'message': 'Auth Token Invalid! Authentication Failed'
                    }
                });
            } else {
                // Return all groups for the user if group id is null
                if (groupId == null) {
                    meetupGroupDB.getGroupsForUser(foundUser.userId, function (userGroups) {
                        res.status(StatusCodes.OK)
                        res.json({
                            'status': StatusCodes.OK,
                            'data': {
                                'user_groups': userGroups
                            }
                        });
                    });
                }
            }
        }
    )
});

router.post('/', function (req, res) {
    const params = req.body;
    const headers = req.headers;

    const authToken = headers.authorization;
    const groupName = params.groupName;
    const groupDescription = params.groupDescription;

    userDB.getUserFromToken(authToken, function (foundUser) {
        if (foundUser == null) {
            res.status(StatusCodes.UNAUTHORIZED);
            res.json({
                'status': StatusCodes.UNAUTHORIZED,
                'data': {
                    'message': 'Auth Token Invalid! Authentication Failed'
                }
            });
        } else {
            const group = new MeetupGroup(uuid4(), foundUser.userId, groupName, groupDescription, [foundUser.userId], [])
            meetupGroupDB.createGroup(group, function (isCreated, createdGroup, message) {
                let statusCode = StatusCodes.FORBIDDEN;
                if (isCreated) {
                    statusCode = StatusCodes.CREATED;
                }
                res.status(statusCode);
                res.json({
                    'status': statusCode,
                    'data': {
                        'group': createdGroup,
                        'message': message,
                    }
                });
            })
        }
    });
});


module.exports = router;
