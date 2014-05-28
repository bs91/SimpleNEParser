parse_section = require('../lib/ParseSection');
boundary = require('../lib/Boundary');
section = require('../lib/Section');
header = require('../lib/Header');

beforeEach(function() {
  this.addMatchers({
    containsInstancesOf: function(object) {
      containsProperTypes = true;
      theObject = this.actual;
      Object.keys(theObject).forEach(function(element,index,array) {
        if (theObject[element].constructor !== object.constructor) {
          containsProperTypes = false;
        }
      });

      return containsProperTypes;
    }
  });
});

describe("Parse", function() {
  beforeEach(function() {
    this.data = [ '\r\nContent-Type: text/plain; charset=ISO-8859-1\r\n\r\n---------- Forwarded message ----------\r\nFrom: anon@gmail.com <anon@gmail.com>\r\nDate: Thu, Jan 3, 2013 at 5:21 PM\r\nSubject: iOS woes\r\nTo: Anon2 <anon2@gmail.com>\r\n\r\n', '\r\nContent-Type: text/html; charset=ISO-8859-1\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n<div dir=3D"ltr"><br><br><div class=3D"gmail_quote">---------- Forwarded me=\r\nssage ----------<br>From: <b class=3D"gmail_sendername"><a href=3D"mailto:a=\r\nnon@gmail.com">anon@gmail.com</a></b><span>dir=3D"ltr">&lt=\r\n;<a>href=3D"mailto:anon@gmail.com">anon@gmail.com</a>&gt;</=\r\nspan><br>\r\nDate: Thu, Jan 3, 2013 at 5:21 PM<br>Subject: iOS woes<br>To: Anon2 &=\r\nlt;<a href=3D"mailto:anon2@gmail.com">anon2@gmail.com</a>&gt;<br><br>=\r\n<br><div dir=3D"ltr"><br></div>\r\n</div><br></div>\r\n\r\n' ];
    this.manipulatee = jasmine.createSpy();
    this.injections = {"boundary": boundary.Boundary,
      "section": section.Section,
      "header": header.Header};
  });

  it("returns a collection of section objects", function() {
    expect(parse_section.Parse(this.data, this.manipulatee, this.injections)).containsInstancesOf(new section.Section());
  });
});
