var http = require('http');
var querystring = require('querystring');
var MailParser = require("mailparser").MailParser; // https://github.com/andris9/mailparser

var server = http.createServer();
server.addListener('request', function(req, res) {
  var chunks = [];
  req.on('data', chunks.push.bind(chunks));
  req.on('end', function() {
    var mailparser = new MailParser();
    mailparser.on("end", function(mail_object) {

      // API for https://github.com/andris9/mailparser
      mail_object.from; // [ { address: 'sender@example.com', name: 'Sender Name' } ]
      mail_object.to;   // [ { address: 'example@mail2webhook.com', name: '' } ]
      mail_object.subject; // "Testing 1 2 3"
      mail_object.html;
      mail_object.text;
      console.log(mail_object.from, mail_object.to, mail_object.subject);
      console.log(mail_object);

      res.writeHead(200, {'content-type': 'text/plain'});
      res.end();
    });
    var params = querystring.parse(chunks.join("").toString());
    mailparser.write(params['message']);
    mailparser.end();
  });
});
var port = process.env.PORT || 3000;
console.log(' [*] Listening on 0.0.0.0:' + port);
server.listen(port, '0.0.0.0');
