var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var defaultWidgets = require('../common/defaultWidgets');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  widgetsLg: {
    type: String,
    default: defaultWidgets.widgetString
  },
  widgetsMd: {
    type: String,
    default: defaultWidgets.widgetString
  },
  widgetsSm: {
    type: String,
    default: defaultWidgets.widgetString
  },
  hash: String,
  salt: String
});

userSchema.methods.setPassword = function (password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    widgets: this.widgets, 
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET");
};

mongoose.model('User', userSchema);
