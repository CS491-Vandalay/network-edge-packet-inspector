var express = require('express');
var request = require('request');

var app = express();

app.get('/',function (req,res){
	res.send("Hello World");
});

var server = app.listen(8090,function(){
	console.log("Server listening on port 8090");
});
