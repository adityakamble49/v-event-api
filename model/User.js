/**
 * User Model - Represents a user of the application with the following properties
 * @param userId
 * @param firstName
 * @param lastName
 * @param emailId
 * @param password
 * @param authToken
 * @constructor
 */
function User(userId, firstName, lastName, emailId, password, authToken) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.emailId = emailId;
    this.password = password;
    this.authToken = authToken;
}

module.exports = User;
