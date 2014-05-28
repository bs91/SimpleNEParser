parse_boundary = require('../lib/ParseBoundary');
boundary = require('../lib/Boundary');
section = require('../lib/Section');
header = require('../lib/Header');

beforeEach(function() {
  this.addMatchers({
    isInstanceOf: function(object) {
      return this.actual.constructor === object.constructor
    }
    isArray: function() {
      return Array.isArray(this.actual);
    }
  });
});

describe("Parse", function() {
  beforeEach(function() {
    this.data = { rawFile: '--00151758858c65c68904d269cc74\r\nContent-Type: multipart/alternative;boundary=00151758858c65c68304d269cc72\r\n\r\n--00151758858c65c68304d269cc72\r\nContent-Type: text/plain; charset=ISO-8859-1\r\n\r\n---------- Forwarded message ----------\r\nFrom: anon@gmail.com <anon@gmail.com>\r\nDate: Thu, Jan 3, 2013 at 5:21 PM\r\nSubject: iOS woes\r\nTo: Anon2 <anon2@gmail.com>\r\n\r\n--00151758858c65c68304d269cc72\r\nContent-Type: text/html;charset=ISO-8859-1\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n<div dir=3D"ltr"><br><br><div>class=3D"gmail_quote">---------- Forwarded me=\r\nssage ----------<br>From: <b>class=3D"gmail_sendername"><a href=3D"mailto:a=\r\nnon@gmail.com">anon@gmail.com</a></b><span dir=3D"ltr">&lt=\r\n;<a href=3D"mailto:anon@gmail.com">anon@gmail.com</a>&gt;</=\r\nspan><br>\r\nDate: Thu, Jan 3, 2013 at 5:21 PM<br>Subject: iOS woes<br>To: Anon2 &=\r\nlt;<a href=3D"mailto:anon2@gmail.com">anon2@gmail.com</a>&gt;<br><br>=\r\n<br><div dir=3D"ltr"><br></div>\r\n</div><br></div>\r\n\r\n--00151758858c65c68304d269cc72--\r\n--00151758858c65c68904d269cc74\r\nContent-Type: image/png; name="Screen Shot 2013-01-03 at 5.21.00 PM.png"\r\nContent-Disposition: attachment; \r\n\tfilename="Screen Shot 2013-01-03 at 5.21.00 PM.png"\r\nContent-Transfer-Encoding: base64\r\nX-Attachment-Id: f_hbigmhf40\r\n\r\nimage data(removed for now because testing was too hard);\r\n--00151758858c65c68904d269cc74\r\nContent-Type: image/png; name="Screen Shot2 2013-01-03 at 5.21.00 PM.png"\r\nContent-Disposition: attachment; \r\n\tfilename="Screen Shot2 2013-01-03 at 5.21.00 PM.png"\r\nContent-Transfer-Encoding: base64\r\nX-Attachment-Id: f_hbigmhf40\r\n\r\nimage data 2 just to test(removed for now because testing was too hard);\r\n--00151758858c65c68904d269cc74--', headers: 'Delivered-To: anon2@gmail.com\r\nReceived: by 10.101.136.9 with SMTP id o9csp692942ann;\r\n        Thu, 3 Jan 2013 14:22:30 -0800 (PST)\r\nReturn-Path: <anon@gmail.com>\r\nReceived-SPF: pass (google.com: domain of anon@gmail.com designates 10.204.7.92 as permitted sender) client-ip=10.204.7.92\r\nAuthentication-Results: mr.google.com; spf=pass (google.com: domain of anon@gmail.com designates 10.204.7.92 as permitted sender) smtp.mail=anon@gmail.com; dkim=pass header.i=@gmail.com\r\nReceived: from mr.google.com ([10.204.7.92])\r\n        by 10.204.7.92 with SMTP id c28mr24287169bkc.86.1357251749485 (num_hops = 1);\r\n        Thu, 03 Jan 2013 14:22:29 -0800 (PST)\r\nDKIM-Signature: v=1; a=rsa-sha256;c=relaxed/relaxed;\r\n        d=gmail.com; s=20120113;\r\nh=mime-version:in-reply-to:references:date:message-id:subject:from:to\r\n:content-type;\r\nbh=WUj+WjnDn18yoz3juWszGoVXXjviFfsN0h1Cyu511Gw=;\r\nb=yPFJhsV3twWYOBKWbPRRQHLbZQEVbdbEROv+d5h/vNuIpF9wi2zmbWDkgotMDmFgLY\r\nob4nbkcAz2l0EvQrPiIHMBd3tL5pqbODI+fgnFlHVtZB+lJ/pLGqWRemsbxv2xOvzy1X\r\nctRSZ5q72DBDF/1+RFlvsfzdJrQ+yFlcmfQQdhe1gQm8U3e099ENl2eLyQhkJsXhgkMR\r\nuLm7VkFrtP14PNHhjc8HndEBNDG4bBMwlnu9sNW13iHSt2/16Yo32oSngNTlrpc70hjk\r\n3RdQ2ut3fHiZ+j26Waea39Pjafs3P8i4ElOjKL7efmK3jjnBfLoptlnH/KyduWcDOT+g\r\nRg3g==\r\nMIME-Version: 1.0\r\nReceived: by 10.204.7.92 with SMTP id c28mr24287169bkc.86.1357251749463; Thu,\r\n 03 Jan 2013 14:22:29 -0800 (PST)\r\nReceived: by 10.204.238.132 with HTTP; Thu, 3 Jan 2013 14:22:29 -0800 (PST)\r\nIn-Reply-To: <CAPcg3=8Kq3gQc=Y8OCKM4Uh2j92q7U-guJ7RL0yB3YzrC6o4SA@mail.gmail.com>\r\nReferences: <CAPcg3=8Kq3gQc=Y8OCKM4Uh2j92q7U-guJ7RL0yB3YzrC6o4SA@mail.gmail.com>\r\nDate: Thu, 3 Jan 2013 17:22:29 -0500\r\nMessage-ID: <CAPcg3=-SbGAmjub2aUnjQkKdvzQDJq1FfWY+qogsuMC4GdKpPQ@mail.gmail.com>\r\nSubject: Fwd: iOS woes\r\nFrom: "Anon" <anon@gmail.com>\r\nTo: Anon2 <anon2@gmail.com>\r\nContent-Type: multipart/mixed; boundary=00151758858c65c68904d269cc74' }
    this.contentType = new header.Header();
    this.manipulatee = jasmine.createSpy();
    this.injections = {"boundary": boundary.Boundary,
      "section": section.Section,
      "header": header.Header};
  });

  it("returns a boundary when a boundary id is found", function() {
    this.contentType.field = "Content-Type";
    this.contentType.val = "multipart/alternative;boundary=0015178858c65c68904d269cc72";
    
    expect(parse_boundary.Parse(this.data, this.contentType, this.manipulatee, this.injections)).isInstanceOf(new boundary.Boundary());
  });

  it("returns null when a boundary id is not found", function() {
    this.contentType.field = "Content-Type";
    this.contentType.val = "someContentType;"

    expect(parse_boundary.Parse(this.data, this.contentType, this.manipulatee, this.injections)).toBe(null);
  });
});

describe("getBoundary", function() {
  beforeEach(function() {
    this.contentType = new header.Header();
  });

  it("returns a boundary id when one is present in the content-type with quotes", function() {
    this.contentType.field = "Content-Type";
    this.contentType.val = "multipart/alternative;boundary=\"0015178858c65c68904d269cc72\"";

    expect(parse_boundary.getBoundary(this.contentType)).toEqual("0015178858c65c68904d269cc72");
  });

  it("returns a boundary id when one is present in the content-type without quotes", function() {
    this.contentType.field = "Content-Type";
    this.contentType.val = "multipart/alternative;boundary=0015178858c65c68904d269cc72";

    expect(parse_boundary.getBoundary(this.contentType)).toEqual("0015178858c65c68904d269cc72");
  });

  it("returns "" when no boundary id is found.", function() {
    this.contentType.field = "Content-Type";
    this.contentType.val = "text/plain";

    expect(parse_boundary.getBoundary(this.contentType)).toEqual("");
  });

});

describe("separateBoundaries", function() {
  beforeEach(function() {
    
  });
  
  it("returns an array", function() {
    expect(parse_boundary.separateBoundaries(this.data).isArray(); 
  });
  
  it("returns an array of data split up by boundary id", function() {
    
  });
});
