var http = require('http');
var fs = require('fs');
var path = require('path');

var port = 8080;

//http://ericsowell.com/blog/2011/5/6/serving-static-files-from-node-js
var app = http.createServer(function (request, response) {
    console.log('request starting for: ' + request.url);
	
	var filePath = '.' + request.url;
	if (filePath == './')
		filePath = './index.htm';
		
	var extname = path.extname(filePath);
	var contentType = 'text/html';
	switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
	}
	
	path.exists(filePath, function(exists) {
		if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					console.log("request failed");
					console.log(error);
					response.writeHead(500);
					response.end();
				}
				else {
					response.writeHead(200, { 'Content-Type': contentType });
					response.end(content, 'utf-8');
				}
			});
		}
		else {
			response.writeHead(404);
			response.end();
		}
	});
	
}).listen(port);
console.log('Server running at http://127.0.0.1:' + port + '/');

//http://stackoverflow.com/questions/20717076/two-way-communication-between-server-and-client-on-socket-io-node-js
var io = require("socket.io").listen(8081);
io.on('connection', function(socket){
	socket.on('saveFile', function(file_name, file_content, callback){
		fs.writeFile(file_name, file_content, function(err){
			if (err){
				console.log(err);
			}
			if (typeof(callback) === 'function'){
				callback();
			}
		});
	});
	socket.on("ensureExists", function(path, mask, cb){
		if (typeof mask == 'function'){
			cb = mask;
			mask = 0777;
		}
		fs.mkdir(path, mask, function(err){
			if (err){
				if (err.code == 'EEXIST') cb(null);
				else cb(err);
			} else cb(null);
		});
	});
});
var publisher = require("socket.io").listen(app);
