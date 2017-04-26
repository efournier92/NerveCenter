var fs = require('fs');

module.exports.getIcons = function(req, res) {
  var path = './public/images/icons';
  var icoList = [];

  fs.readdir(path, function(err, files) {
    if (err) {
      sendJSONresponse(res, 400, {
        "message": "Directory not found"
      });
    }
    files.forEach(function(ico) {
      icoList.push(ico) 
    });

    res.status(200).json(icoList);
  });
};
