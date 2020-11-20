const mongoose = require('mongoose');

/**
 * Event DB - Event Database
 */
class EventDB {

    constructor() {
        if (!EventDB.instance) {
            EventDB.instance = this;
        }

        return EventDB.instance;
    }

    /**
     * Setup Schema for User
     */
    setupEventSchema() {
        let eventSchema = new mongoose.Schema({
            eventId: {type: String, required: true},
            creatorId: {type: String, required: true},
            eventName: {type: String, required: true},
            eventDescription: {type: String, required: true},
            eventDate: {type: String, required: true},
            eventTime: {type: String, required: true},
            eventLink: {type: String, required: true},
            eventMeetupGroupId: {type: String, required: true},
        });

        this.Event = mongoose.model('Event', eventSchema);
    }


    /**
     * Get Event by eventId
     * @param eventId
     * @param callback
     */
    getEvent(eventId, callback) {
        this.Event.findOne({eventId: eventId})
            .exec()
            .then(function (foundEvent) {
                callback(foundEvent);
            });
    }

    getEventsCreatedByUser(user, callback) {
        this.Event.find({creatorId: user.userId})
            .exec()
            .then(function (userEvents) {
                callback(userEvents)
            })
    }

    getEventsUserRsvp(user, callback) {
    }

    addEvent(event, callback) {
        const newEvent = this.Event(event);
        newEvent.save()
            .then(function (insertedEvent) {
                callback(insertedEvent);
            });
    }
}

module.exports = EventDB;
