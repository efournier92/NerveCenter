var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

var authCtrl = require('../controllers/auth.controller');
var userCtrl = require('../controllers/user.controller');
var commonCtrl = require('../controllers/common.controller');

// Auth API 
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

// Ico API
router.get('/ico', commonCtrl.getIcons);

// Ico API
router.get('/defaultgrid', commonCtrl.getDefaultGrid);

// User API
router.get('/user', auth, userCtrl.profileRead);

// User Widget API
router.put('/user', auth, userCtrl.updateWidgets);

module.exports = router;

