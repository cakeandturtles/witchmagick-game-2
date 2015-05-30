function ExportOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-export", "option_save.png", "trans.png");
	
	this.is_selectable = false;
	this.level_file_name = "level_name";
}
extend(Option, ExportOption);

ExportOption.prototype.onContextMenu = function(level){
	var self = this;
	level.pause();
	
	var path = "./level_files/"+self.level_file_name+"/";
	Dialog.Confirm("", function(){			
		var json = level.Export();
		nodejs.ensureExists(path, function(err){
			try{
				if (!err){
					for (var i = 0; i < json.rooms.length; i++){
						for (var j = 0; j < json.rooms[i].length; j++){
							for (var k = 0; k < json.rooms[i][j].length; k++){
								nodejs.saveFile(path + i + "_" + j + "_" + k + ".json", json.rooms[i][j][k]);
							}
						}
					}
					nodejs.saveFile(path + "etc.json", json.etc);
					alert("level saved to file!");
					return
				}else{
					console.log(err);
				}
			}catch(e){
				console.log(e);
			}
			alert("error saving level!");
		});
	}, "save level", "save", function(){
		this.architect.tryResume()
		removeClass(this.dom, "selected");
	}.bind(this));
	
	var level_name_dom = document.createElement("div");
	var text = document.createTextNode("level name:");
	var input = document.createElement("input");
	input.type = "text";
	input.style.width = "128px";
	input.onkeydown = function(e){
		self.level_file_name = this.value;
	}
	level_name_dom.appendChild(text);
	level_name_dom.appendChild(document.createElement("br"));
	level_name_dom.appendChild(input);
	
	Dialog.AddElement(level_name_dom);
	input.focus();
}