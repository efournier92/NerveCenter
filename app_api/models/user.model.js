var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var defaultWidgets = '[{"url":"https://www.google.com/","icon":"img/Google.png"},{"url":"http://en.wikipedia.org/wiki/Main_Page","icon":"img/Wiki.png"},{"url":"http://cake.whatbox.ca:57094/","icon":"img/RTorrent.png"},{"url":"https://github.com/","icon":"img/GitHub.png"},{"url":"https://twitter.com","icon":"img/Twitter.png"},{"url":"https://www.google.com/imghp?hl=en&tab=wi&ei=KA6OU4CWBtDisATKzoKwBA&ved=0CAQQqi4oAg","icon":"img/Image.png"},{"url":"https://getpocket.com/a/queue/list/","icon":"img/ReadLater.png"},{"url":"http://www.youtube.com/","icon":"img/Tube.png"},{"url":"https://app.simplenote.com/","icon":"img/Notes.png"},{"url":"https://www.linkedin.com","icon":"img/Linked.png"},{"url":"http://www.cnn.com/","icon":"img/CNN.png"}]'

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  widgetsLg: {
    type: String,
    default: defaultWidgets
  },
  widgetsMd: {
    type: String,
    default: defaultWidgets
  },
  widgetsSm: {
    type: String,
    default: defaultWidgets
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
