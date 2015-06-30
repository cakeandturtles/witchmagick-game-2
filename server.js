var faye = require('faye');
var bayeux = new faye.NodeAdapter({mount: '.'});

var connect = require('connect');
var serveStatic = require('serve-static');


bayeux.attach(connect);
connect().use(serveStatic(".")).listen(8000);

/*bayeux.getClient().subscribe('/readfile', function(message){
	var file_name = message.file_name;
	
	var fs = require('fs');
	fs.readFile(file_name, {encoding: "UTF-8"}, function(error, json){
		bayeux.getClient().publish('/readfile', {
			error: error,
			json: json
		});
	});
});*/