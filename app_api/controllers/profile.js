var mongoose = require('mongoose');
var User = mongoose.model('User');
module.exports.profileRead = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    User.findById(req.payload._id)
      .exec(function(err, user) {
        res.status(200).json(user);
        console.log("users!", user.email);
      });
  }
};

module.exports.updateWidgets = function(req, res) {
pry = require('pryjs')
  eval(pry.it)
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    User.findById(req.payload._id)
    .exec(function(err, user) {
      if (err)
        res.send(err);

      user.widgets = req.body.name;

      user.save(function(err) {
        if (err)
          res.send(err);
        console.log("User Updated: ", user);
      });
    });
  };
};
