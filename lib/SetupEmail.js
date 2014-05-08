util = require('./Util');
boundary = require('./Boundary');
section = require('./Section');
header = require('./Header');
parser = require('./Parser');

exports.Setup = function(data, basic_email) {
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

  basic_email = parser.Parse(data, basic_email, injections);
  basic_email.raw = data;
  basic_email = exports.extractHeaderInfo(basic_email.headers, importantHeaders, basic_email);
  importantFields.forEach(function(element, index, array) {
    basic_email = exports.searchSections(basic_email, basic_email, element);
  });

  if (basic_email['data'] !== undefined) {
    basic_email.text = basic_email['data'];
  }
  
  return basic_email;
};

exports.extractHeaderInfo = function extractHeaderInfo(headers, importantData, manipulatee) {
  importantData.forEach(function(element, index, array) {
    var data = headers[element.headerInfo];
    if (data !== undefined) {
      manipulatee[element.propName] = Array.isArray(data) ? element.index != null ? data[element.index].val.trim() : util.arrayOfAttribute("val", data) : data.val.trim();
    }
  });

  return manipulatee;
};

exports.searchSections = function searchSections(basic_email, manipulatee, importantField) {
  if(manipulatee.boundaries != null && manipulatee.boundaries !== {}) {
    Object.keys(manipulatee.boundaries).forEach(function(elementObj, indexObj, arrayObj) {
      var parts = manipulatee.boundaries[elementObj].sections[importantField.searchInfo];
      if (parts != null) {
        parts = Array.isArray(parts) ? importantField.index != null ? parts[importantField.index].data : util.arrayOfAttribute("data", parts) : parts.data;
        basic_email[importantField.propName] = basic_email[importantField.propName] !== undefined ? util.toArray(basic_email[importantField.propName]).concat(util.toArray(parts)) : parts;
      } else {
        Object.keys(manipulatee.boundaries[elementObj].sections).forEach(function(elementSect, indexSect, arraySect) {
          //console.log(manipulatee.boundaries[elementObj]);
          basic_email = exports.searchSections(basic_email, manipulatee.boundaries[elementObj].sections[elementSect], importantField);
        });
      }
    });
  }

  return basic_email;
};
