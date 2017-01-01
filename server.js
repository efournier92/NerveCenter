var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use('/assets', express.static(__dirname + '/node_modules'));
app.use('/assets', express.static(__dirname + '/bower_components'));

// Import userAuth files
require('./app/user/user.model.js');
require('./app_api/config/passport');

app.listen(8080);
console.log("App listening on port 8080");

// var mongodb = require('mongodb');
// var MongoClient = mongodb.MongoClient;
// var url = 'mongodb://localhost:27019/my_database_name';
// MongoClient.connect(url, function (err, db) {
//   if (err) {
//     console.log('Unable to connect to the mongoDB server. Error:', err);
//   } else {
//     console.log('Connection established to', url);
//     db.close();
//   }
// });
