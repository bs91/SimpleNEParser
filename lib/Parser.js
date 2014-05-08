parse_header = require('./ParseHeader');
parse_boundary = require('./ParseBoundary');

exports.Parse = function Parse(data, manipulatee, injections) {
  var headerBlock = parse_header.Parse(data, injections);
  manipulatee.headers = headerBlock.headers;
  var contentType = manipulatee.headers["Content-Type"];
  if (contentType !== undefined) {
    boundary = parse_boundary.Parse(headerBlock.splitEmail, contentType, manipulatee, injections);
    if (boundary !== null) {
      manipulatee.boundaries[boundary.id] = boundary;
    } else {
      manipulatee["data"] = headerBlock.splitEmail.rawFile;
    }
  }

  return manipulatee;
};
