var SimpleEmail = require('../lib/SimpleNEParser');

SimpleEmail.fromPath(__dirname + '/data2.txt', function(email) {
  console.log(email);
});

/*SimpleEmail.fromString('nowai from string', function(email) {
  console.log(email);
});*/
