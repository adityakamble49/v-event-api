const express = require('express');
const cors = require('cors');

const DBManager = require('./dbutils/DBManager');

const index = require('./controller/index.js');
const userController = require('./controller/UserController.js');
const meetupGroupController = require('./controller/MeetupGroupController.js');
const eventController = require('./controller/EventController.js');
const bodyParser = require('body-parser');

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.all("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});
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
