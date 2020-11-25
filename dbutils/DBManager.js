const mongoose = require('mongoose');
const UserDB = require("./UserDB");
const MeetupGroupDB = require("./MeetupGroupDB");
const EventDB = require("./EventDB");

/**
 * DBManager - To Manage General Database Related Tasks
 */
class DBManager {

    constructor() {
        if (!DBManager.instance) {
            DBManager.instance = this;
            this.userDB = new UserDB();
            this.meetupGroupDB = new MeetupGroupDB();
            this.eventDB = new EventDB();
        }

        return DBManager.instance;
    }

    /**
     * Setup Mongoose and create DB Connection
     * @param connectionOpenCallback
     */
    setupMongoose(connectionOpenCallback) {
        mongoose.connect('mongodb://localhost/v_event_db', {useNewUrlParser: true});
        mongoose.set('debug', true);
        const db = mongoose.connection;
        const classThis = this;
        db.on('error', console.error.bind(console, 'Connection Error'));
        db.once('open', function () {
            console.log('Database Connection Successful');
            classThis.setupAllSchemas();
            connectionOpenCallback();
        });
    }

    /**
     * Setup all Mongoose Schemas
     */
    setupAllSchemas() {
        this.userDB.setupUserSchema();
        this.meetupGroupDB.setupMeetupGroupDB();
        this.eventDB.setupEventSchema();
    }
}

module.exports = DBManager;
