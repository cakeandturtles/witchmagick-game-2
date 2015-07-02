function FileManager(){
}

FileManager.saveFile = function(file_name, file_content, callback){
	try{
		var fs = require('fs');
		fs.writeFile(file_name, file_content, function(err){
			if (err){
				alert(err);
			}
			if (typeof(callback) === "function"){
				callback();
			}
		});
	}catch(err){
		//fallback if running without nodejs in dom
		
	}
}

FileManager.ensureExists = function(path, mask, cb) {
	try{
		var fs = require('fs');
		if (typeof mask == 'function') { // allow the `mask` parameter to be optional
			cb = mask;
			mask = 0777;
		}
		fs.mkdir(path, mask, function(err) {
			if (err) {
				if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
				else cb(err); // something else went wrong
			} else cb(null); // successfully created folder
		});
	}catch(err){
		//fallback if running without nodejs in dom
	}
}

FileManager.loadFile = function(path, callback){
	try{
		var fs = require('fs');
		fs.readFile(path, {encoding: "UTF-8"}, callback);
	}catch(err){
		//fallback if running without nodejs in dom
		loadExternalFile(path, callback);
	}
}