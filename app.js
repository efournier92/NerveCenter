// REQUIREMENTS //////////////////////////////////////////////////////
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');

// EXPRESS ///////////////////////////////////////////////////////////
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/app_client'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use('/assets', express.static(__dirname + '/node_modules'));
app.use('/assets', express.static(__dirname + '/bower_components'));

// MONGO /////////////////////////////////////////////////////////////
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/nerveCenter';

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
    // var collection = db.collection('user');
    db.close();
  }
});

// USER //////////////////////////////////////////////////////////////
require('./app_server/user/user.model.js');
require('./app_server/user/passport.js');
app.use(passport.initialize());
// app.use('/api', routesApi);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// WIDGET ////////////////////////////////////////////////////////////

// SERVER ////////////////////////////////////////////////////////////
app.listen(8080);
console.log("App listening on port 8080");

