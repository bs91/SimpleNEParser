fs = require('fs');
setup_email = require('./SetupEmail');
email = require('./Email');

exports.fromPath = function(filePath, on_ready) {
  fs.readFile(filePath, function(err, data) {
    if(err) throw err;
    var basic_email = setup_email.Setup(data.toString(), new email.Email());
    on_ready(basic_email);
  });
};

exports.fromString = function(emailString, on_ready) {
  var email = setup_email.Setup(emailString, new email.Email());
  on_ready(email);
};
