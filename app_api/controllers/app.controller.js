var fs = require('fs');

module.exports.getIcons = function(req, res) {
  var path = './public/images/icons';
  var iconList = [];

  fs.readdir(path, function(err, files) {
    if (err) return;
    files.forEach(function(f) {
      console.log('Files: ' + f);
    });
  });
};
