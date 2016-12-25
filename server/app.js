var express  = require('express');
var app      = express();
var mongoose = require('mongoose');

var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');

app.use('/assets', express.static(__dirname + 'server/node_modules'));
app.use('/assets', express.static(__dirname + 'server/bower_components'));
app.use(express.static(__dirname + '/client'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

app.listen(8080);
console.log("App listening on port 8080");

