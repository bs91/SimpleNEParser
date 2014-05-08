parser = require('./Parser');
util = require('./Util');

exports.Parse = function(data, contentType, manipulatee, injections) {
  var boundary = new injections.boundary();
  var boundaryid = exports.getBoundary(contentType.val);
  boundary.id = boundaryid;
  
  if (boundary.id !== "") {
    boundary.data = exports.separateBoundaries(data.rawFile, boundary);
    boundary.sections = exports.separateSections(boundary.data, manipulatee,
    injections);

    return boundary;
  }

  return null
};

exports.getBoundary = function getBoundary(contentType) {
  var start = contentType.indexOf("boundary=");
  return start > -1 ? contentType.substring(start + 9).replace("\"","") : "";
};

exports.separateBoundaries = function separateBoundaries(data, boundary) {
  var parts = data.split("--" + boundary.id);
  parts.shift();
  parts.pop();

  return parts;
};

exports.separateSections = function separateSections(data, manipulatee, injections) {
  var sections = {};
  data.forEach(function(element, index, array) {
    var section = new injections.section();
    var parts = parser.Parse(element, section, injections);
    section.headers = parts.headers;
    section.data = parts.data !== undefined ? parts.data : element;
    var attachments = parts.headers["Content-Disposition"] !== undefined;
    var name = attachments ? parts.headers["Content-Disposition"].val : parts.headers["Content-Type"].val;
    name = name.substring(0, name.indexOf(";")).trim();
    sections[name] = sections[name] !== undefined ? util.toArray(sections[name]).concat([section]) : section;
  });

  return sections
};
