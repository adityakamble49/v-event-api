const mongoose = require('mongoose');

/**
 * MeetupGroupDB - Meetup Group Database
 */
class MeetupGroupDB {

    constructor() {
        if (!MeetupGroupDB.instance) {
            MeetupGroupDB.instance = this;
        }

        return MeetupGroupDB.instance;
    }

    /**
     * Setup Schema for Meetup Group
     */
    setupMeetupGroupDB() {
        let meetupGroupSchema = new mongoose.Schema({
            groupId: {type: String, required: true},
            creatorId: {type: String, required: true},
            groupName: {type: String, required: true},
            groupDescription: {type: String, required: true},
            participantIds: {type: Array, required: true},
            eventIds: {type: Array, required: true},
        });

        this.MeetupGroup = mongoose.model('MeetupGroup', meetupGroupSchema);
    }


    /**
     * Get Meetup Group by groupId
     * @param groupId
     * @param callback
     */
    getGroupByGroupId(groupId, callback) {
        this.MeetupGroup.findOne({groupId: groupId})
            .exec()
            .then(function (foundGroup) {
                callback(foundGroup);
            });
    }

    getAllGroupNames(callback) {
        this.MeetupGroup.find({}, 'groupName')
            .exec()
            .then(function (groupNames) {
                let allGroupNames = [];
                for (let i = 0; i < groupNames.length; i++) {
                    allGroupNames.push(groupNames[i].groupName);
                }
                callback(allGroupNames);
            });
    }

    isGroupNameExist(groupName, callback) {
        this.getAllGroupNames(function (allGroupNames) {
            let exist = false;
            for (let i = 0; i < allGroupNames.length; i++) {
                if (groupName === allGroupNames[i]) {
                    exist = true;
                    break;
                }
            }
            callback(exist);
        })
    }

    getGroupsForUserId(userId, callback) {
        this.MeetupGroup.find()
            .exec()
            .then(function (allGroups) {
                let userGroups = [];
                for (let i = 0; i < allGroups.length; i++) {
                    if (allGroups[i].participantIds.includes(userId)) {
                        userGroups.push(allGroups[i]);
                    }
                }
                callback(userGroups);
            })
    }

    createGroup(group, callback) {
        const meetupGroupContext = this;
        this.isGroupNameExist(group.groupName, function (exist) {
            if (exist) {
                callback(false, null, 'Group Name Exists')
            } else {
                const newMeetupGroup = meetupGroupContext.MeetupGroup(group);
                newMeetupGroup.save()
                    .then(function (createdGroup) {
                        callback(true, createdGroup, 'Group Created Successfully');
                    });
            }
        });
    }

    updateGroupDetails(updateGroup, callback) {
        this.MeetupGroup.updateOne({groupId: updateGroup.groupId}, {
            groupName: updateGroup.groupName,
            groupDescription: updateGroup.groupDescription
        })
            .exec()
            .then(function (updateInfo) {
                if (updateInfo.ok === 1) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
    }

    addParticipantIdToGroup(group, participantId, callback) {
        group.participantIds.push(participantId);
        this.MeetupGroup.updateOne({groupId: group.groupId}, {participantIds: group.participantIds})
            .exec()
            .then(function (result) {
                callback(result);
            })
    }

    deleteGroup(group, callback) {
        this.MeetupGroup.deleteOne({groupId: group.groupId})
            .exec()
            .then(function (result) {
                callback(result)
            });
    }
}

module.exports = MeetupGroupDB;
