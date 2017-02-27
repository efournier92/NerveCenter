var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

  console.log("HIT",auth);
var ctrlProfile = require('../controllers/profile');
// var ctrlWidget = require('../controllers/widget');
var ctrlAuth = require('../controllers/authentication');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
// widget 
router.put('/profile/:id', auth, ctrlProfile.updateWidgets);

// router.put('/profile/:id', function (req, res) {
//   // var id = req.payload._id;
//   console.log("PUT WORKS!");
// });

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
