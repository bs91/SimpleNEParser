parser = require('./Parser');
parse_section = require('./ParseSection');

exports.Parse = function(data, contentType, manipulatee, injections) {
  var boundary = new injections.boundary();
  var boundaryid = exports.getBoundary(contentType.val);
  boundary.id = boundaryid;
  
  if (boundary.id !== "") {
    boundary.data = exports.separateBoundaries(data.rawFile, boundary);
    boundary.sections = parse_section.Parse(boundary.data, manipulatee,
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
