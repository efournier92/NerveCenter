var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.profileRead = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "Unauthorized: Private Profile"
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
      "message" : "Unauthorized: Private Profile"
    });
  } else {
    User.findById(req.payload._id, function(err, user) {
      if (err) return handleError(err);
      widgetString = JSON.stringify(req.body[0]);
      size = req.body[1].size;

      if (size == 'Lg') {
        user.widgetsLg = widgetString;
      } else if (size == 'Md') {
        user.widgetsMd = widgetString;
      } else if (size == 'Sm') {
        user.widgetsSm = widgetString;
      }

      user.save(function(err, updatedUser) {
        if (err) return handleError(err);
        res.send(updatedUser);
      });
    });
  };
};
