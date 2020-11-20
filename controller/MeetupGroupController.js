// Import Libraries
const express = require('express');
const bodyParser = require('body-parser');
const httpStatusCodes = require('http-status-codes');
const StatusCodes = httpStatusCodes.StatusCodes;
const ReasonPhrases = httpStatusCodes.ReasonPhrases;

const UserDB = require('../dbutils/UserDB');
const MeetupGroupDB = require('../dbutils/MeetupGroupDB');
const MeetupGroup = require("../model/MeetupGroup");
const uuid4 = require("uuid4");

const urlencodedParser = bodyParser.urlencoded({extended: true});

const userDB = new UserDB();
const meetupGroupDB = new MeetupGroupDB();
const router = express.Router();

router.use(urlencodedParser);

/**
 * Get all groups for User Id
 */
router.get('/', function (req, res) {
    const param = req.query;
    const headers = req.headers;

    const authToken = headers.authorization;

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
                // Return all groups for the user
                meetupGroupDB.getGroupsForUserId(foundUser.userId, function (userGroups) {
                    res.status(StatusCodes.OK)
                    res.json({
                        'status': StatusCodes.OK,
                        'data': {
                            'groups': userGroups
                        }
                    });
                });
            }
        }
    )
});

/**
 * Get specific group details
 */
router.get('/:groupId', function (req, res) {
    const params = req.params;
    const headers = req.headers;

    const authToken = headers.authorization;
    const groupId = params.groupId;

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
                // Return group details for given group id
                meetupGroupDB.getGroupByGroupId(groupId, function (foundGroup) {
                    let statusCode = StatusCodes.NOT_FOUND;
                    let message = 'Group Not Found';
                    if (foundGroup != null) {
                        statusCode = StatusCodes.OK
                        message = 'Group Found'
                    }
                    res.status(statusCode)
                    res.json({
                        'status': statusCode,
                        'data': {
                            'group': foundGroup,
                            'message': message
                        }
                    })
                })
            }
        }
    )
});

/**
 * Create Group for User
 */
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

/**
 * Update Group Info - Name and Description
 */
router.put('/:groupId', function (req, res) {
    const path_params = req.params;
    const body = req.body;
    const headers = req.headers;

    const authToken = headers.authorization;
    const groupId = path_params.groupId;
    const groupName = body.groupName;
    const groupDescription = body.groupDescription;

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
                // Return group details for given group id
                meetupGroupDB.getGroupByGroupId(groupId, function (foundGroup) {
                    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
                    let message = ReasonPhrases.INTERNAL_SERVER_ERROR;

                    if (foundGroup == null) {
                        statusCode = StatusCodes.NOT_FOUND
                        message = 'Group Not found'
                        res.status(statusCode);
                        res.json({
                            'status': statusCode,
                            'data': {'message': message}
                        });

                    } else if (foundGroup.creatorId !== foundUser.userId) {
                        statusCode = StatusCodes.UNAUTHORIZED
                        message = 'Only Group creator can update group details'
                        res.status(statusCode);
                        res.json({
                            'status': statusCode,
                            'data': {'message': message}
                        });
                    } else {
                        foundGroup.groupName = groupName != null ? groupName : foundGroup.groupName;
                        foundGroup.groupDescription = groupDescription != null ? groupDescription : foundGroup.groupDescription;
                        meetupGroupDB.updateGroupDetails(foundGroup, function (isGroupUpdated) {
                            statusCode = StatusCodes.OK;
                            message = 'Group Details Updated';
                            res.status(statusCode);
                            res.json({
                                'status': statusCode,
                                'data': {
                                    'message': message
                                }
                            })
                        })
                    }
                })
            }
        }
    )
});


module.exports = router;
