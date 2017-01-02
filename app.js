// REQUIREMENTS //////////////////////////////////////////////////////
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');

// EXPRESS ///////////////////////////////////////////////////////////
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use('/assets', express.static(__dirname + '/node_modules'));
app.use('/assets', express.static(__dirname + '/bower_components'));

// MONGO /////////////////////////////////////////////////////////////

// USER //////////////////////////////////////////////////////////////
require('./app/user/user.model.js');
require('./app_api/config/passport');
app.use(passport.initialize());
app.use('/api', routesApi);

// WIDGET ////////////////////////////////////////////////////////////

// SERVER ////////////////////////////////////////////////////////////
app.listen(8080);
console.log("App listening on port 8080");

