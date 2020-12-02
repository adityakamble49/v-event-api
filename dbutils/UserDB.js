const mongoose = require('mongoose');

/**
 * UserDB - User Database Related operations
 */
class UserDB {

    constructor() {
        if (!UserDB.instance) {
            UserDB.instance = this;
        }

        return UserDB.instance;
    }

    /**
     * Setup Schema for User
     */
    setupUserSchema() {
        let userSchema = new mongoose.Schema({
            userId: {type: String, required: true},
            firstName: {type: String, required: true},
            lastName: {type: String, required: true},
            emailId: {type: String, required: true},
            password: {type: String, required: true},
            authToken: {type: String, required: true},
        });

        this.User = mongoose.model('User', userSchema);
    }


    /**
     * Get User by emailID
     * @param emailId
     * @param callback
     */
    getUser(emailId, callback) {
        this.User.findOne({emailId: emailId})
            .exec()
            .then(function (foundUser) {
                callback(foundUser);
            });
    }

    isValidUser(emailId, password, callback) {
        this.getUser(emailId, function (user) {
            if (user != null && user.password === password) {
                callback(true, user, "User Login Successful");
            } else if (user != null && user.password !== password) {
                callback(false, null, "Password Invalid");
            } else {
                callback(false, null, "User doesn't exist!")
            }
        })
    }

    getUserFromToken(authToken, callback) {
        this.User.findOne({authToken: authToken})
            .exec()
            .then(function (foundUser) {
                callback(foundUser);
            });
    }

    addUser(user, callback) {
        const userDBContext = this;
        this.getUser(user.emailId, function (foundUser) {
            if (foundUser === null) {
                const newUser = userDBContext.User(user);
                newUser.save()
                    .then(function (insertedUser) {
                        callback(true, insertedUser);
                    })
            } else {
                callback(false, null, 'User Already Exist');
            }
        })
    }
}

module.exports = UserDB;
