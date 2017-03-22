var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlUser = require('../controllers/user.controller');
// var ctrlWidget = require('../controllers/widget');
var ctrlAuth = require('../controllers/auth.controller.js');

// User API
router.get('/user', auth, ctrlUser.profileRead);

// User Widget API
router.put('/user/:id', auth, ctrlUser.updateWidgets);

// Auth API 
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;

