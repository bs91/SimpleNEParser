exports.toArray = function(element) {
  return Array.isArray(element) ? element : [element];
};

exports.arrayOfAttribute = function(attribute, data) {
  var newArray = [];
  data.forEach(function(element, index, array) {
    if(element[attribute] != null) {
      newArray.push(element[attribute].trim());
    }
  });

  return newArray;
};
