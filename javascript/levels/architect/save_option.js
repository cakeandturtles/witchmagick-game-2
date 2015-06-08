function ExportOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-export", "option_save.png", "trans.png");
	
	this.is_selectable = false;
	this.is_toggleable = true;
	this.level_file_name = "level_name";
}
extend(Option, ExportOption);

ExportOption.prototype.onContextMenu = function(level){
	var self = this;
	
	if (hasClass(this.dom, "selected")){
		Dialog.Close();
		addClass(this.dom, "selected");
	}else{
		level.pause();
		
		Dialog.Confirm("", function(){
			LevelLoader.Export(self.level_file_name, level, true);
		}, "save level", "save", function(){
			this.architect.tryResume()
			removeClass(this.dom, "selected");
		}.bind(this));
		
		var level_name_dom = document.createElement("div");
		var text = document.createTextNode("level name:");
		var input = document.createElement("input");
		input.type = "text";
		input.style.width = "128px";
		input.onkeyup = function(e){
			self.level_file_name = this.value;
			console.log(self.level_file_name);
		}
		level_name_dom.appendChild(text);
		level_name_dom.appendChild(document.createElement("br"));
		level_name_dom.appendChild(input);
		
		Dialog.AddElement(level_name_dom);
		input.focus();
	}
}