exports.Email = Email;

function Email() {
  this.boundaries = {};
  this.headers = {};
  this.raw;
  this.text;
  this.html;
  this.attachments;
  this.replyTo;
  this.delivered;
  this.sent;
  this.from;
  this.to;
  this.subject;
};
