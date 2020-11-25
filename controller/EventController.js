// Import Libraries
const express = require('express');
const bodyParser = require('body-parser');
const httpStatusCodes = require('http-status-codes');
const StatusCodes = httpStatusCodes.StatusCodes;

const UserDB = require('../dbutils/UserDB');
const EventDB = require('../dbutils/EventDB');
const User = require("../model/User");
const Event = require("../model/Event");
const uuid4 = require("uuid4");

const urlencodedParser = bodyParser.urlencoded({extended: true});

const userDB = new UserDB();
const eventDB = new EventDB();
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

// Get All Events
// Get Events Created By User

// Update Event
// Delete Event

module.exports = router;
