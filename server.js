var express = require('express');
var app = express();
var fs = require('fs');


app.get('/*', function(req, res){
  res.sendFile(__dirname + req.path);
});


var port = process.env.PORT || 1234;

//var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
//var port = process.env.OPENSHIFT_NODEJS_PORT || 1234;

app.listen(port);
console.log("Server started...");
