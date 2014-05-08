util = require('./Util');

exports.Parse = function(data, injections) {
  var splitEmail = exports.separateHeaders(data);
  var headers = exports.getHeaders(splitEmail.headers, injections);
  return {"splitEmail": splitEmail, "headers": headers};
};

exports.separateHeaders = function separateHeaders(data) {
  var parts = data.split(/\r\r|\n\n|\r\n\r\n/);
  var headers = parts.shift().trim();
  parts = data.replace(headers.toString(), "").trim();
  return {"rawFile": parts, "headers": headers};
};

exports.getHeaders = function getHeaders(data, injections) {
  var headers = {};
  separatedHeaders = data.split(/\r(?=\S)|\n(?=\S)|\r\n(?=\S)/g);
  separatedHeaders.forEach(function(element, index, array) {
    var header = new injections.header();
    var parts, field, val;
    parts = element.split(":");
    field = parts.shift();
    val = parts.join(":");
    header.field = field;
    header.val = val;
    
    if (field.trim().length > 0) {
      headers[field] = headers[field] !== undefined ? util.toArray(headers[field]).concat([header]) : header;
    }
  });

  return headers;
};
