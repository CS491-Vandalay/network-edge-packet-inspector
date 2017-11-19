var express = require('express'),
	logger = require('morgan'),
	app = express(),
	template = require('pug').compileFile(__dirname+'/src/docs/api-docs/templates/base.pug');

const path = require('path');

app.use(logger('dev'));

app.use(express.static(path.join(__dirname+"/src/docs/static")));

app.get('/docs/api', function (req,res){
	try{
		console.log(path.join(__dirname+'/src/docs/api-docs'));
		var html = template({title:'Home'});
		res.send(html);
	} catch(e){
		console.log(e);
	}
});

app.use('/docs/api/node_modules',express.static(path.join(__dirname,'/node_modules')));

app.get('*',function (req,res){
    res.redirect("/docs/api");
});

var server = app.listen(8090,function(){
	console.log("Server listening on port 8090");
});
