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
     * Setup Schema for Event
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
        return this.Event.findOne({eventId: eventId})
            .exec();
    }

    getEventsCreatedByUser(user) {
        return this.Event.find({creatorId: user.userId})
            .exec();
    }

    getEventsByMeetupGroupId(meetupGroupId) {
        return this.Event.find({eventMeetupGroupId: meetupGroupId})
            .exec();
    }

    addEvent(event) {
        const newEvent = this.Event(event);
        return newEvent.save();
    }
}

module.exports = EventDB;
