SimpleNEParser
=============

A simple Node.js email parser.


Requirements
------------

This service requires SimpleNEParser to take in an email path or string and return a parsed email object. 

Usage
-----
Require the SimpleNEParser as a module and setup your document using either the fromPath or fromString options like so:

```javascript
var SimpleEmail = require('./SimpleNEParser');

SimpleEmail.fromPath('data.txt', function(email) {
//  Use parsed email object here.
});

SimpleEmail.fromString('nowai from string', function(email) {
// Use parsed email object here.
});
```

### SimpleEmail.raw

`SimpleEmail.raw` returns a the email exactly how it was read in.:

```javascript
var SimpleEmail = require('./SimpleNEParser');

SimpleEmail.fromString('nowai from string', function(email) {
  Console.log(SimpleEmail.raw);
});

// Returns: "nowai from string"
```

### SimpleEmail.text

`SimpleEmail.text` will return the text/plain portion of the email.

```javascript
var SimpleEmail = require('./SimpleNEParser');

SimpleEmail.fromPath('data.txt', function(email) {
  Console.log(SimpleEmail.text);
});

/* Returns: 
---------- Forwarded message ----------
From: Anon <anon@gmail.com>
Date: Thu, Jan 3, 2013 at 5:21 PM
Subject: iOS woes
To: Anon2 <anon2@gmail.com>

from 

Content-Type: text/plain; charset=ISO-8859-1

---------- Forwarded message ----------
From: Anon <anon@gmail.com>
Date: Thu, Jan 3, 2013 at 5:21 PM
Subject: iOS woes
To: Anon2 <anon2@gmail.com>
*/
```


### SimpleEmail.html

`SimpleEmail.html` will return the text/html portion of the email.

```javascript
var SimpleEmail = require('./SimpleNEParser');

SimpleEmail.fromPath('data.txt', function(email) {
  Console.log(SimpleEmail.html);
});

/* Returns: 
<div dir=3D"ltr"><br><br><div class=3D"gmail_quote">---------- Forwarded me=
ssage ----------<br>From: <b class=3D"gmail_sendername"><a href=3D"mailto:a=
non@gmail.com">anon@gmail.com</a></b> <span dir=3D"ltr">&lt=
;<a href=3D"mailto:anon@gmail.com">anon@gmail.com</a>&gt;</=
span><br>
Date: Thu, Jan 3, 2013 at 5:21 PM<br>Subject: iOS woes<br>To: Anon2 &=
lt;<a href=3D"mailtoanon2@gmail.com">anon2@gmail.com</a>&gt;<br><br>=
<br><div dir=3D"ltr"><br></div>
</div><br></div>

from 

Content-Type: text/html; charset=ISO-8859-1
Content-Transfer-Encoding: quoted-printable

<div dir=3D"ltr"><br><br><div class=3D"gmail_quote">---------- Forwarded me=
ssage ----------<br>From: <b class=3D"gmail_sendername"><a href=3D"mailto:a=
non@gmail.com">anon@gmail.com</a></b> <span dir=3D"ltr">&lt=
;<a href=3D"mailto:anon@gmail.com">anon@gmail.com</a>&gt;</=
span><br>
Date: Thu, Jan 3, 2013 at 5:21 PM<br>Subject: iOS woes<br>To: Anon2 &=
lt;<a href=3D"mailtoanon2@gmail.com">anon2@gmail.com</a>&gt;<br><br>=
<br><div dir=3D"ltr"><br></div>
</div><br></div>
*/
```

### SimpleEmail.attachments

`SimpleEmail.attachments` will return an array of attachment information from the email.

```javascript
var SimpleEmail = require('./SimpleNEParser');

SimpleEmail.fromPath('data.txt', function(email) {
  Console.log(SimpleEmail.attachments);
});

/* Returns: 
['iVBORw0KGgoAAAANSUhEUgAABFQAAAG9CAIAAAC07LXqAAAYIWlDQ1BJQ0MgUHJvZmlsZQAAWAmt
eXk8Vd33/z733Nk8DxmuWYbMczLPQjJHXPM8XEOSTHlUqIhEREoKoTJXUiSJpAEpiiSSTCVJ8dt6
6nk+n9/39/3vd16ve+77rrP22muvtfZZe60LAG89NTw8GMMMQEhoFM3WRJ/i5OxCIYwCBGAAHeAA
/FSvyHA9GxtL8L9eXwchN7yeyW7K+l/Z/t8PWLx9Ir0AQGzgY0/vSK8QiOsBQJu9wmlRAOA25Ynu
iwrfxFkQs9OgghCXbWK/v3HzJvb8G/f+4rGzNYA8YwAQ6alUmh8ADLOQTonx8oNyGOkBwLOGegeE
wmEUiHd4+VO9AeD1gDwyISFhmzgTYknP/5Dj9x+YSvX8RyaV6vcP/nstcCSc2DAgMjyYuv/Xj/+f
t5DgaGivX5cAvNNHBu22gN+c0G6xXlSj3RBzQ3zc38fM8je9PDxK3/Y3/VZAlJkdxOyQ57l/tKn9
bzwdHWSvBzEfpP8ICrPY5Id2wnCHelpZQ8wKsahXpAG0/eZcGNU4fzvH3zyW3j6GRhDDKMI40cJs...']

from 

Content-Type: image/png; name="Screen Shot 2013-01-03 at 5.21.00 PM.png"
Content-Disposition: attachment; 
	filename="Screen Shot 2013-01-03 at 5.21.00 PM.png"
Content-Transfer-Encoding: base64
X-Attachment-Id: f_hbigmhf40

iVBORw0KGgoAAAANSUhEUgAABFQAAAG9CAIAAAC07LXqAAAYIWlDQ1BJQ0MgUHJvZmlsZQAAWAmt
eXk8Vd33/z733Nk8DxmuWYbMczLPQjJHXPM8XEOSTHlUqIhEREoKoTJXUiSJpAEpiiSSTCVJ8dt6
6nk+n9/39/3vd16ve+77rrP22muvtfZZe60LAG89NTw8GMMMQEhoFM3WRJ/i5OxCIYwCBGAAHeAA
/FSvyHA9GxtL8L9eXwchN7yeyW7K+l/Z/t8PWLx9Ir0AQGzgY0/vSK8QiOsBQJu9wmlRAOA25Ynu
iwrfxFkQs9OgghCXbWK/v3HzJvb8G/f+4rGzNYA8YwAQ6alUmh8ADLOQTonx8oNyGOkBwLOGegeE
wmEUiHd4+VO9AeD1gDwyISFhmzgTYknP/5Dj9x+YSvX8RyaV6vcP/nstcCSc2DAgMjyYuv/Xj/+f
t5DgaGivX5cAvNNHBu22gN+c0G6xXlSj3RBzQ3zc38fM8je9PDxK3/Y3/VZAlJkdxOyQ57l/tKn9
bzwdHWSvBzEfpP8ICrPY5Id2wnCHelpZQ8wKsahXpAG0/eZcGNU4fzvH3zyW3j6GRhDDKMI40cJs...
*/
```

### SimpleEmail.replyTo

`SimpleEmail.replyTo` returns the value from the Return-Path header.

```javascript
var SimpleEmail = require('./SimpleNEParser');

SimpleEmail.fromPath('data.txt', function(email) {
  Console.log(SimpleEmail.replyTo);
});

// Returns: "<anon@gmail.com>"
```

### SimpleEmail.delivered

`SimpleEmail.delivered` returns the value from the the first Received header, this informs you
of when the message was actually delivered.

```javascript
var SimpleEmail = require('./SimpleNEParser');

SimpleEmail.fromPath('data.txt', function(email) {
  Console.log(SimpleEmail.delivered);
});

// Returns: "Thu, 3 Jan 2013 14:22:30 -0800 (PST)"
```

### SimpleEmail.sent

`SimpleEmail.sent` returns the value from the the Date header, this informs you
of when the message was first sent.

```javascript
var SimpleEmail = require('./SimpleNEParser');

SimpleEmail.fromPath('data.txt', function(email) {
  Console.log(SimpleEmail.sent);
});

// Returns: "Thu, 3 Jan 2013 17:22:29 -0500"
```

### SimpleEmail.from

`SimpleEmail.from` returns the value from the the From header, this informs you
of the name and email that were seen in the from header. (Use this data at your own risk due to the fact that
it can be manipulated by anyone.)

```javascript
var SimpleEmail = require('./SimpleNEParser');

SimpleEmail.fromPath('data.txt', function(email) {
  Console.log(SimpleEmail.from);
});

// Returns: "Anon <anon@gmaiil.com>"
```

### SimpleEmail.to

`SimpleEmail.to` returns the value from the the To header, this informs you
usually of the name and email of who the email was sent to.

```javascript
var SimpleEmail = require('./SimpleNEParser');

SimpleEmail.fromPath('data.txt', function(email) {
  Console.log(SimpleEmail.to);
});

// Returns: "Anon2 <anon2@gmaiil.com>"
```

### SimpleEmail.subject

`SimpleEmail.subject` returns the value from the the Subject header, this informs you 
of the subject of them email sent.

```javascript
var SimpleEmail = require('./SimpleNEParser');

SimpleEmail.fromPath('data.txt', function(email) {
  Console.log(SimpleEmail.subject);
});

// Returns: "iOS woes"
```


Credits
-------

XxBlakeFailxX

SimpleNEParser is maintained by XxBlakeFailxX, and
is distributed under the [MIT License](/LICENSE.md).
