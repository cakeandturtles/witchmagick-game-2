function ExportOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-export", "option_save.png", "trans.png");
	
	this.is_selectable = false;
	this.is_toggleable = true;
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
			LevelLoader.Export(level.level_name, level, true);
		}, "save level", "save", function(){
			this.architect.tryResume()
			removeClass(this.dom, "selected");
		}.bind(this));
		
		var level_name_dom = document.createElement("div");
		var text = document.createTextNode("level name:");
		var input = document.createElement("input");
		input.type = "text";
		input.style.width = "128px";
		input.value = level.level_name;
		input.onkeyup = function(e){
			level.level_name = this.value;
		}
		level_name_dom.appendChild(text);
		level_name_dom.appendChild(document.createElement("br"));
		level_name_dom.appendChild(input);
		
		Dialog.AddElement(level_name_dom);
		input.focus();
	}
}