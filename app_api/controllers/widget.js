// var mongoose = require('mongoose');
// var User = mongoose.model('User');

// module.exports.updateWidgets = function(req, res) {
//   console.log("Hit");
//   pry = require('pryjs')
//   eval(pry.it)
//   if (!req.payload._id) {
//     res.status(401).json({
//       "message" : "EAZY!UnauthorizedError: private profile"
//     });
//   } else {
//     User.findById(req.payload._id)
//     .exec(function(err, user) {
//       if (err)
//         res.send(err);

//       user.widgets = req.body.widgets;

//       user.save(function(err) {
//         if (err)
//           res.send(err);
//         console.log("User Updated: ", user);
//       });
//     });
//   };
// };
