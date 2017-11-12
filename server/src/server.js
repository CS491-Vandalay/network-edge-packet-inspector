var express = require('express');

var app = express();

app.get('/',function (req,res){
	res.send("Hello World");
});

app.get('/api/docs', function (req,res){
	res.send("API DOCS");
});

var server = app.listen(8090,function(){});
