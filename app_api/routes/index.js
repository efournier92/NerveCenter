var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrilWidget = require('../controllers/widget');
var ctrlAuth = require('../controllers/authentication');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
// widget 
// router.put('/widget', auth, ctrlProfile.updateWidgets);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
