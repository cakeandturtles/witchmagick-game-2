function SaveOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-save", "option_save.png", "trans.png");
	
	this.is_selectable = false;
	this.level_file_name = "level.xml";
}
extend(Option, SaveOption);

SaveOption.prototype.onContextMenu = function(level){
	var self = this;
	var level_xml = "hey :)";
	
	Dialog.Confirm("", function(){
		var fs = require('fs');
		fs.writeFile("./level_files/"+self.level_file_name+".xml", level_xml, function(err){
			if (err){
				alert(err);
			}
			alert("file saved!");
		});
	}, "save level", "save");
	
	var level_name_dom = document.createElement("div");
	var text = document.createTextNode("level (file) name:");
	var input = document.createElement("input");
	input.type = "text";
	input.style.width = "128px";
	input.onchange = function(e){
		self.level_file_name = this.value;
	}
	var suffix = document.createTextNode(".xml");
	level_name_dom.appendChild(text);
	level_name_dom.appendChild(document.createElement("br"));
	level_name_dom.appendChild(input);
	level_name_dom.appendChild(suffix);
	
	Dialog.AddElement(level_name_dom);
}