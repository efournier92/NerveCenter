var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use('/assets', express.static(__dirname + '/node_modules'));
app.use('/assets', express.static(__dirname + '/bower_components'));

app.listen(8080);
console.log("App listening on port 8080");

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
  var url = 'mongodb://localhost:27017';

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("MongoDB Affirmative");

    db.close();
  });

