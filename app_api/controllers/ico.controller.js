var fs = require('fs');

module.exports.getIcons = function (req, res) {
  var path = 'public/img/ico';
  var icoList = [];

  fs.realpath(path, function (err, path) {
    if (err) {
      res.status(400).json({
        'message' : 'Directory Not Found'
      });
    }
  });

  fs.readdir(path, function (err, files) {
    res.status(200).json(files);
  });
};
