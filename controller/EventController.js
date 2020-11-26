// Import Libraries
const express = require('express');
const bodyParser = require('body-parser');
const httpStatusCodes = require('http-status-codes');
const StatusCodes = httpStatusCodes.StatusCodes;

const UserDB = require('../dbutils/UserDB');
const EventDB = require('../dbutils/EventDB');
const MeetupGroupDB = require('../dbutils/MeetupGroupDB');

const User = require("../model/User");
const Event = require("../model/Event");
const uuid4 = require("uuid4");

const urlencodedParser = bodyParser.urlencoded({extended: true});

const userDB = new UserDB();
const eventDB = new EventDB();
const meetupGroupDB = new MeetupGroupDB();

const router = express.Router();

router.use(urlencodedParser);

/**
 * Create Event for Meetup Group
 */
router.post('/', function (req, res) {
    const params = req.body;
    const headers = req.headers;

    const authToken = headers.authorization;

    const eventName = params.eventName;
    const eventDescription = params.eventDescription;
    const eventDate = params.eventDate;
    const eventTime = params.eventTime;
    const eventLink = params.eventLink;
    const eventMeetupGroupId = params.eventMeetupGroupId;

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
            eventDB.getEventsByMeetupGroupId(eventMeetupGroupId)
                .then(function (foundEvents) {
                    for (let i = 0; i < foundEvents.length; i++) {
                        if (foundEvents[i].eventName === eventName) {
                            res.status(StatusCodes.FORBIDDEN);
                            res.json({
                                'status': StatusCodes.FORBIDDEN,
                                'data': {
                                    'message': 'Event Name already exist'
                                }
                            });
                            return;
                        }
                    }
                    const event = new Event(uuid4(), foundUser.userId, eventName, eventDescription, eventDate, eventTime,
                        eventLink, eventMeetupGroupId);
                    eventDB.addEvent(event)
                        .then(function (createdEvent) {
                            res.status(StatusCodes.CREATED);
                            res.json({
                                'status': StatusCodes.CREATED,
                                'data': {
                                    'message': 'Event Created',
                                    'event': createdEvent
                                }
                            });
                        });
                });
        }
    });
});

/**
 * Get All Events for User
 */
router.get('/', function (req, res) {
    const params = req.body;
    const headers = req.headers;
    const query_params = req.query;

    const authToken = headers.authorization;

    const meetupGroupId = query_params.groupId;
    const createdBy = query_params.createdBy;

    userDB.getUserFromToken(authToken, function (foundUser) {
        if (foundUser == null) {
            res.status(StatusCodes.UNAUTHORIZED);
            res.json({
                'status': StatusCodes.UNAUTHORIZED,
                'data': {
                    'message': 'Auth Token Invalid! Authentication Failed'
                }
            });
        } else if (meetupGroupId == null && createdBy == null) {
            meetupGroupDB.getGroupsForUserId(foundUser.userId, function (foundGroups) {
                let foundGroupIds = foundGroups.map(x => x.groupId);
                eventDB.getEventsByMeetupGroupId(foundGroupIds)
                    .then(function (foundEvents) {
                        res.status(StatusCodes.OK);
                        res.json({
                            'status': StatusCodes.OK,
                            'data': {
                                'message': 'All events for User',
                                'events': foundEvents
                            }
                        });
                    })
            });
        } else if (meetupGroupId != null && createdBy == null) {
            // Get Events for Given Meetup Group
            eventDB.getEventsByMeetupGroupId(meetupGroupId)
                .then(function (foundEvents) {
                    res.status(StatusCodes.OK);
                    res.json({
                        'status': StatusCodes.OK,
                        'data': {
                            'message': 'Events for Meetup Group',
                            'events': foundEvents
                        }
                    });
                });
        } else if (meetupGroupId == null && createdBy != null) {
            // Get Events Created by User
            eventDB.getEventsCreatedByUser(foundUser.userId)
                .then(function (foundEvents) {
                    res.status(StatusCodes.OK);
                    res.json({
                        'status': StatusCodes.OK,
                        'data': {
                            'message': 'Events Created by User',
                            'events': foundEvents
                        }
                    });
                });
        } else if (meetupGroupId != null && createdBy != null) {
            // Get Events Created by User
            eventDB.getEventsCreatedByUserForMeetupGroup(foundUser.userId, meetupGroupId)
                .then(function (foundEvents) {
                    res.status(StatusCodes.OK);
                    res.json({
                        'status': StatusCodes.OK,
                        'data': {
                            'message': 'Events Created by User for Meetup Group',
                            'events': foundEvents
                        }
                    });
                });
        }
    });
});

/**
 * Get Event details
 */
router.get('/:eventId', function (req, res) {
    const params = req.params;
    const headers = req.headers;

    const authToken = headers.authorization;

    const eventId = params.eventId;

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
            eventDB.getEvent(eventId)
                .then(function (foundEvent) {
                    if (foundEvent != null) {
                        res.status(StatusCodes.OK);
                        res.json({
                            'status': StatusCodes.OK,
                            'data': {
                                'message': 'Event Details',
                                'event': foundEvent
                            }
                        });
                    } else {
                        res.status(StatusCodes.NOT_FOUND);
                        res.json({
                            'status': StatusCodes.NOT_FOUND,
                            'data': {
                                'message': 'Event Details not Found',
                                'event': foundEvent
                            }
                        });
                    }
                })
        }
    });

});

/**
 * Update Event Details
 */
router.put('/:eventId', function (req, res) {
    const params = req.params;
    const body = req.body;
    const headers = req.headers;

    const authToken = headers.authorization;

    const eventId = params.eventId;

    const eventName = body.eventName;
    const eventDescription = body.eventDescription;
    const eventDate = body.eventDate;
    const eventTime = body.eventTime;
    const eventLink = body.eventLink;

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
            eventDB.getEvent(eventId)
                .then(function (foundEvent) {
                    if (foundEvent == null) {
                        res.status(StatusCodes.NOT_FOUND);
                        res.json({
                            'status': StatusCodes.NOT_FOUND,
                            'data': {
                                'message': 'Event Details not Found',
                                'event': foundEvent
                            }
                        });
                    } else if (foundEvent.creatorId === foundUser.userId) {

                        foundEvent.eventName = eventName != null ? eventName : foundEvent.eventName;
                        foundEvent.eventDescription = eventDescription != null ? eventDescription : foundEvent.eventDescription;
                        foundEvent.eventDate = eventDate != null ? eventDate : foundEvent.eventDate;
                        foundEvent.eventTime = eventTime != null ? eventTime : foundEvent.eventTime;
                        foundEvent.eventLink = eventLink != null ? eventLink : foundEvent.eventLink;

                        eventDB.updateEvent(foundEvent)
                            .then(function (result) {
                                res.status(StatusCodes.OK);
                                res.json({
                                    'status': StatusCodes.OK,
                                    'data': {
                                        'message': 'Event Details Updated',
                                        'event': foundEvent,
                                        'result': result
                                    }
                                });
                            })
                    } else {
                        res.status(StatusCodes.FORBIDDEN);
                        res.json({
                            'status': StatusCodes.FORBIDDEN,
                            'data': {
                                'message': 'Event Can be updated by Creator Only',
                            }
                        });
                    }
                });
        }
    })
});


/**
 * Delete Event
 */
router.delete('/:eventId', function (req, res) {
    const path_params = req.params;
    const headers = req.headers;

    const authToken = headers.authorization;

    const eventId = path_params.eventId;

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
            eventDB.getEvent(eventId)
                .then(function (foundEvent) {
                    if (foundEvent == null) {
                        res.status(StatusCodes.NOT_FOUND);
                        res.json({
                            'status': StatusCodes.NOT_FOUND,
                            'data': {
                                'message': 'Event Not Found',
                            }
                        });
                    } else if (foundEvent.creatorId === foundUser.userId) {
                        eventDB.deleteEvent(eventId)
                            .then(function (result) {
                                res.status(StatusCodes.OK);
                                res.json({
                                    'status': StatusCodes.OK,
                                    'data': {
                                        'message': 'Event Deleted',
                                        'result': result
                                    }
                                });
                            });
                    } else {
                        res.status(StatusCodes.FORBIDDEN);
                        res.json({
                            'status': StatusCodes.FORBIDDEN,
                            'data': {
                                'message': 'Event Can be deleted by Creator only',
                            }
                        });
                    }

                })
        }
    })
});

module.exports = router;
