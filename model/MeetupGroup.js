/**
 * Meetup Group Model
 * @param groupId
 * @param creatorId
 * @param groupName
 * @param groupDescription
 * @param participantIds
 * @param eventIds
 * @constructor
 */
function MeetupGroup(groupId, creatorId, groupName, groupDescription, participantIds, eventIds) {
    this.groupId = groupId;
    this.creatorId = creatorId;
    this.groupName = groupName;
    this.groupDescription = groupDescription;
    this.participantIds = participantIds;
    this.eventIds = eventIds;
}

module.exports = MeetupGroup;
