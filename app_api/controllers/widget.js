var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.updateWidgets = function(req, res) {
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
