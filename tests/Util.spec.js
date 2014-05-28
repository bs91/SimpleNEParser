util = require('../lib/Util');

beforeEach(function() {
  this.addMatchers({
    isArray: function() {
      return Array.isArray(this.actual);
    }
  });
});

describe("toArray", function() {
  beforeEach(function() {
    this.element = "foo";
  });
  
  it("returns an array", function() {
    expect(util.toArray(this.element)).isArray();
  });
  
  it("contains passed element in returned array", function() {
    expect(util.toArray(this.element)).toContain(this.element);
  });
});

describe("arrayOfAttribute", function() {
  beforeEach(function() {
    this.attribute = "text";
    this.data = [{"text": "test1"}, {"text": "test2"}, {"text": "test3"}];
  });

  it("returns an array", function() {
    expect(util.arrayOfAttribute(this.attribute, this.data)).isArray();
  });

  it("contains an array of the passed attributes from the provided array of objects", function() {
    var expected_outcome = ["test1", "test2", "test3"];

    expect(util.arrayOfAttribute(this.attribute, this.data)).toEqual(expected_outcome);
  });
});
