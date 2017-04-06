var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var authCtrl = require('../controllers/auth.controller');
var icoCtrl = require('../controllers/ico.controller');
var userCtrl = require('../controllers/user.controller');

// Auth API 
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

// Ico API
router.get('/ico', icoCtrl.getIcons);

// User API
router.get('/user', auth, userCtrl.profileRead);

// User Widget API
router.put('/user', auth, userCtrl.updateWidgets);

module.exports = router;

