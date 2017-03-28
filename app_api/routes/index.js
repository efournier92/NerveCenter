var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var userCtrl = require('../controllers/user.controller');
var authCtrl = require('../controllers/auth.controller');

// User API
router.get('/user', auth, userCtrl.profileRead);

// User Widget API
router.put('/user', auth, userCtrl.updateWidgets);

// Auth API 
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

module.exports = router;

