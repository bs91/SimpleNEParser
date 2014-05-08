parser = require('./Parser');
util = require('./Util');

exports.Parse = function(data, manipulatee, injections) {
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
