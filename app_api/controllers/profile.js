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
  console.log("SERVER: ", req);

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "EAZY!UnauthorizedError: private profile"
    });
  } else {
    // User.findById(req.payload._id)
    // .exec(function(err, user) {
    //   if (err)
    //     res.send(err);
      // pry = require('pryjs')
      // user.widgets = req.body;

      // User.update(
      //   { id: req.payload._id },
      //   { widgets: 'STRING' }
      // )

    User.findById(req.payload._id, function (err, user) {
      if (err) return handleError(err);

      user.widgets = req.payload._id;
      user.save(function (err, updatedUser) {
        if (err) return handleError(err);
        res.send(updatedUser);
      });
    });
    console.log("DID IT@@@!!!!")
    // user.save(function(err) {
    //   if (err)
    //     res.send(err);
    //   console.log("User Updated: ", user);
    // });
  };
};
