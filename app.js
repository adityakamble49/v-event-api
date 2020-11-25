const express = require('express');
const DBManager = require('./dbutils/DBManager');

const index = require('./controller/index.js');
const userController = require('./controller/UserController.js');
const meetupGroupController = require('./controller/MeetupGroupController.js');
const eventController = require('./controller/EventController.js');

const app = express();

app.use('/', index);
app.use('/user', userController);
app.use('/group', meetupGroupController);
app.use('/event', eventController);

app.get('/*', function (req, res) {
    res.json({'error': 'Not Found'})
});

const dbManager = new DBManager();
dbManager.setupMongoose(setupHttpServer);

function setupHttpServer() {
    app.listen(8080, function (req, res) {
        console.log('Server Started');
    });
}
