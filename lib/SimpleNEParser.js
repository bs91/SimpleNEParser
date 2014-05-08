fs = require('fs');
email = require('./Email');
boundary = require('./Boundary');
section = require('./Section');
header = require('./Header');

exports.fromPath = function(filePath, on_ready) {
  fs.readFile(filePath, function(err, data) {
    if(err) throw err;
    var basic_email = setupEmail(data.toString(), new email.Email());
    on_ready(basic_email);
  });
};

exports.fromString = function(emailString, on_ready) {
  var email = setupEmail(emailString, new email.Email());
  on_ready(email);
};

function setupEmail(data, basic_email) {
  var injections = { 
    "boundary": boundary.Boundary,
    "section": section.Section,
    "header": header.Header
  };

  var importantFields = [
    {"propName": "text", "searchInfo": "text/plain"},
    {"propName": "html", "searchInfo": "text/html"},
    {"propName": "attachments", "searchInfo": "attachment"}
  ];

  var importantHeaders = [
    {"propName": "replyTo", "headerInfo": "Return-Path"},
    {"propName": "delivered", "headerInfo": "Received", "index": "0"},
    {"propName": "sent", "headerInfo": "Date"},
    {"propName": "from", "headerInfo": "From"},
    {"propName": "to", "headerInfo": "Delivered-To"},
    {"propName": "subject", "headerInfo": "Subject"}
  ];

  basic_email = coreParse(data, basic_email, injections);
  basic_email.raw = data;
  basic_email = extractHeaderInfo(basic_email.headers, importantHeaders, basic_email);
  importantFields.forEach(function(element, index, array) {
    basic_email = searchSections(basic_email, basic_email, element);
  });
  
  if (basic_email['data'] !== undefined) {
    basic_email.text = basic_email['data'];
  }

  return basic_email;
};

function extractHeaderInfo(headers, importantData, manipulatee) {
  importantData.forEach(function(element, index, array) {
    var data = headers[element.headerInfo];
    if (data !== undefined) {
      manipulatee[element.propName] = Array.isArray(data) ? element.index != null ? data[element.index].val.trim() : arrayOfAttribute("val", data) : data.val.trim();
    }
  });
  return manipulatee;
};

function searchSections(basic_email, manipulatee, importantField) {
  if(manipulatee.boundaries != null && manipulatee.boundries !== {}) {
    Object.keys(manipulatee.boundaries).forEach(function(elementObj, indexObj, arrayObj) {
      var parts = manipulatee.boundaries[elementObj].sections[importantField.searchInfo];
      if (parts != null) {
      parts = Array.isArray(parts) ? importantField.index != null ? parts[importantField.index].data : arrayOfAttribute("data", parts) : parts.data;
        basic_email[importantField.propName] = basic_email[importantField.propName] !== undefined ? toArray(basic_email[importantField.propName]).concat(toArray(parts)) : parts;
      }
      else {
        Object.keys(manipulatee.boundaries[elementObj].sections).forEach(function(elementSect, indexSect, arraySect) {
          basic_email = searchSections(basic_email, manipulatee.boundaries[elementObj].sections[elementSect], importantField);
        });
      }
    });
  }
  return basic_email;
};

function coreParse(data, manipulatee, injections) {
  var headerBlock = parseHeader(data, injections);
  manipulatee.headers = headerBlock.headers;
  var contentType = manipulatee.headers["Content-Type"];
  if (contentType !== undefined) { 
    boundary = parseBoundary(headerBlock.splitEmail, contentType, manipulatee, injections);
    if (boundary !== null ) {
      manipulatee.boundaries[boundary.id] = boundary;
    }
    else {
      manipulatee["data"] = headerBlock.splitEmail.rawFile;
    }
  }
  return manipulatee;
};

function parseHeader(data, injections) {
  var splitEmail = separateHeaders(data);
  var headers = getHeaders(splitEmail.headers, injections);
  return {"splitEmail": splitEmail, "headers": headers};
};

function separateHeaders(data) {
  var parts = data.split(/\r\r|\n\n|\r\n\r\n/);
  var headers = parts.shift().trim();
  parts = data.replace(headers.toString(), "").trim();
  return { "rawFile": parts, "headers": headers};
};

function getHeaders(data, injections) {
  var headers = {};
  separatedHeaders = data.split(/\r(?=\S)|\n(?=\S)|\r\n(?=\S)/g);
  separatedHeaders.forEach(function(element, index, array) {
    var header =  new injections.header();
    var parts, field, val;
    parts = element.split(":");
    field = parts.shift();
    val = parts.join(":");
    header.field = field;
    header.val = val;
    if (field.trim().length > 0) {
      headers[field] = headers[field] !== undefined ? toArray(headers[field]).concat([header]) : header;
    }
  });
  return headers;
};

function parseBoundary(data, contentType, manipulatee, injections) {
  var boundary = new injections.boundary();
  var boundaryid = getBoundary(contentType.val);
  boundary.id = boundaryid;
  if (boundary.id !== "") {
    boundary.data = separateBoundaries(data.rawFile, boundary);
    boundary.sections = separateSections(boundary.data, manipulatee, injections);
    return boundary;
  }
  return null
};

function getBoundary(contentType) {
  var start = contentType.indexOf("boundary=");
  return start > -1 ? contentType.substr(start + 9).replace("\"","") : "";
};

function separateBoundaries(data, boundary) {
  var parts = data.split("--" + boundary.id);
  parts.shift();
  parts.pop();
  return parts;
};

function separateSections(data, manipulatee, injections) {
  var sections = {};
  data.forEach(function(element, index, array) {
    var section = new injections.section();
    var parts  = coreParse(element, section, injections);
    section.headers = parts.headers;
    section.data = parts.data !== undefined ? parts.data : element;
    var attachments = parts.headers["Content-Disposition"] !== undefined;
    var name = attachments ? parts.headers["Content-Disposition"].val : parts.headers["Content-Type"].val;
    name = name.substring(0, name.indexOf(";")).trim();
    sections[name] = sections[name] !== undefined ? toArray(sections[name]).concat([section]) : section;
  });
  return sections
};


function toArray(element) {
  return Array.isArray(element) ? element : [element];
};


function arrayOfAttribute(attribute, data) {
  var newArray = [];
  data.forEach(function(element, index, array) {
    if(element[attribute] != null) {
      newArray.push(element[attribute].trim())
    }
  });
  return newArray;
};
