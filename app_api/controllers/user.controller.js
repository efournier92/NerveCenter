var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.profileRead = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UNAUTHORIZED: Private Profile"
    });
  } else {
    User.findById(req.payload._id)
      .exec(function(err, user) {
        res.status(200).json(user);
      });
  }
};

module.exports.updateWidgets = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UNAUTHORIZED: Private Profile"
    });
  } else {
    User.findById(req.payload._id, function(err, user) {
      if (err) return handleError(err);

      user.widgets = req.payload._id;
      user.save(function(err, updatedUser) {
        if (err) return handleError(err);
        res.send(updatedUser);
      });
    });
  };
};
