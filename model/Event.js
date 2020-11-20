/**
 * Event Model
 * @param eventId
 * @param creatorId
 * @param eventName
 * @param eventDescription
 * @param eventDate
 * @param eventTime
 * @param eventLink
 * @param eventMeetupGroupId
 * @constructor
 */
function Event(eventId, creatorId, eventName, eventDescription, eventDate, eventTime, eventLink, eventMeetupGroupId) {
    this.eventId = eventId;
    this.creatorId = creatorId;
    this.eventName = eventName;
    this.eventDescription = eventDescription;
    this.eventDate = eventDate;
    this.eventTime = eventTime;
    this.eventLink = eventLink;
    this.eventMeetupGroupId = eventMeetupGroupId;
}

module.exports = Event
