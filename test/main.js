var SimpleEmail = require('./SimpleNEParser');

SimpleEmail.fromPath('data.txt', function(email) {
//  console.log(email);
});

SimpleEmail.fromString('nowai from string', function(email) {
//  console.log(email);
});
