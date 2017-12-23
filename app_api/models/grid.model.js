var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var defaultWidgets = require('../common/defaultGrid');

var gridSchema = new mongoose.Schema({
  _owner: {
    type: Number,
    ref: 'User'
  },
  name: {
    type: String
  },
  contents: {
    type: String,
    default: defaultWidgets.widgetString
  }
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
    widgetsLg: this.widgetsLg,
    widgetsSm: this.widgetsSm,
    exp: parseInt(expiry.getTime() / 1000)
  }, process.env.JWT_SECRET);
};

mongoose.model('User', userSchema);

