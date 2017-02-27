var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  widgets: {
    type: String,
  default: '[{"sizeX":1,"sizeY":1,"row":0,"col":0,"url":"https://www.google.com/","icon":"img/Google.png"},{"sizeX":1,"sizeY":1,"row":0,"col":1,"url":"http://en.wikipedia.org/wiki/Main_Page","icon":"img/Wiki.png"},{"sizeX":1,"sizeY":1,"row":0,"col":2,"url":"http://cake.whatbox.ca:57094/","icon":"img/RTorrent.png"},{"sizeX":1,"sizeY":1,"row":0,"col":3,"url":"https://github.com/","icon":"img/GitHub.png"},{"sizeX":1,"sizeY":1,"row":0,"col":4,"url":"https://twitter.com","icon":"img/Twitter.png"},{"sizeX":1,"sizeY":1,"row":1,"col":0,"url":"https://www.google.com/imghp?hl=en&tab=wi&ei=KA6OU4CWBtDisATKzoKwBA&ved=0CAQQqi4oAg","icon":"img/Image.png"},{"sizeX":1,"sizeY":1,"row":1,"col":1,"url":"https://getpocket.com/a/queue/list/","icon":"img/ReadLater.png"},{"sizeX":1,"sizeY":1,"row":1,"col":2,"url":"http://www.youtube.com/","icon":"img/Tube.png"},{"sizeX":1,"sizeY":1,"row":1,"col":3,"url":"https://app.simplenote.com/","icon":"img/Notes.png"},{"sizeX":1,"sizeY":1,"row":1,"col":4,"url":"https://www.linkedin.com","icon":"img/Linked.png"},{"sizeX":1,"sizeY":1,"row":1,"col":5,"url":"http://www.cnn.com/","icon":"img/CNN.png"}]'
  },
  hash: String,
  salt: String
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

mongoose.model('User', userSchema);
