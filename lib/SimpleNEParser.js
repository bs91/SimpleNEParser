fs = require('fs');

exports.fromPath = function(filePath, on_ready) {
  fs.readFile(__dirname + '/' + filePath, function(err, data) {
    if(err) throw err;
    var basic_email = setupEmail(new Email(), data.toString());
    on_ready(basic_email);
  });
};

exports.fromString = function(emailString, on_ready) {
  var email = new Email(emailString);
  on_ready(email);
};

var Email = function() {
  this.raw;
  this.text;
  this.html;
  this.attachments;
  this.replyTo;
  this.delivered;
  this.sent;
  this.from;
  this.to;
  this.subject;
};

function setupEmail(basic_email, data) {
  basic_email.raw = data;
  var headerBlock = parseHeader(data);
  var importantData = {
    "text": "text/plain", 
    "html": "text/html",
    "attachments": "attachment",
    "replyTo": "Return-Path",
    "delivered": "Received",
    "sent": "Date",
    "from": "From",
    "to": "Delivered-To",
    "subject": "Subject"
  };
  extractHeaderInfo(headerBlock.headers, basic_email);
  var contentType = getContentType(headerBlock.headers, "Content-Type");
  var boundaryBlock = parseBoundary(data, contentType);
  if (boundaryBlock.length > 1) {
    
  }
  return email;
};

function extractHeaderInfo(headers, importantData, basic_email) {
};

function parseHeader(data) {
  var splitEmail = separateHeaders(data);
  var headers = getHeaders(splitEmail.headers);
  return {"splitEmail": splitEmail, "headers": headers};
};

function parseBoundary(data, contentType) {
  var boundary = getBoundary(contentType.val);
  var splitBoundaries = separateBoundaries(data.rawFile, boundary);
  return splitBoundaries;
};

function separateHeaders(data) {
  var parts = data.split(/\r\n\r\n/g);
  var headers = parts.shift();
  parts = parts.join("\r\n\r\n");
  return { "rawFile": parts, "headers": headers};
};

function separateBoundaries(data, boundary) {
  var parts = data.split("--" + boundary);
  parts.shift();
  return parts;
};

function getHeaders(data) {
  var headers = [];
  separatedHeaders = data.split(/\r\n(?=\S)/g);
  separatedHeaders.forEach(function(element, index, array) {
    var parts;
    var field;
    var val;
    parts = element.split(":");
    field = parts.shift();
    val = parts.join(":");
    headers.push({"field" : field, "val" : val});
  });
  return headers;
};

function getSpecificHeader(headers, headerInfo) {
  var header;
  headers.forEach(function(element, index, array) {
    element.field.indexOf(headerInfo) > -1 ? contentType = element : ""; 
  });
  return header;
};

function getBoundary(contentType) {
  return contentType.substr(contentType.indexOf("boundary=") + 9).replace("\"",
  "");
};
