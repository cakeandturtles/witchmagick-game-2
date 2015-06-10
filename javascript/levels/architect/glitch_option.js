function GlitchOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-glitch", "option_glitch1.png", "trans.png");
	
	this.is_selectable = false;
	this.is_toggleable = true;
}
extend(Option, GlitchOption);

GlitchOption.prototype.onContextMenu = function(level){
	if (hasClass(this.dom, "selected")){
		Dialog.Close();
		addClass(this.dom, "selected");
	}else{
		level.pause();
		
		Dialog.Alert("", "room glitch manager", function(){
			this.architect.tryResume();
			removeClass(this.dom, "selected");
		}.bind(this));
		
		var text = document.createTextNode("Press G to switch glitches");
		
		var room_glitches = document.createElement("ul");
		room_glitches.style.listStyleType = "hiragana";
		room_glitches.id = "glitch_option_room_glitches";
		function refreshGlitchList(){
			var room = level.room;
			var room_glitches = document.getElementById("glitch_option_room_glitches");
			room_glitches.innerHTML = "";
			for (var i = 0; i < room.glitches.length; i++){
				if (i === 0){
					room_glitches.appendChild(document.createTextNode("room's glitch list: "));
				}
				var glitch_dom = document.createElement("li");
				
				var deleteme = document.createElement("input");
				deleteme.type = "submit";
				deleteme.style.width = "16px";
				deleteme.style.height = "16px";
				deleteme.style.padding = "0px";
				deleteme.value = "x";
				deleteme.onclick = function(e){
					room.RemoveGlitch(this);
					refreshGlitchList();
				}.bind(room.glitches[i]);
				
				var glitch_text = document.createTextNode(" " + room.glitches[i].type);
				
				glitch_dom.appendChild(deleteme);
				glitch_dom.appendChild(glitch_text);
				room_glitches.appendChild(glitch_dom);
			}
		}
		Dialog.AddElement(room_glitches);
		refreshGlitchList();
		
		var div = document.createElement("div");
		var text = document.createTextNode("glitch type:");
		var dropdown = document.createElement("select");
		for (var i = 0; i < Glitch.DEFAULT_GLITCHES.length; i++){
			var option = document.createElement("option");
			option.value = Glitch.DEFAULT_GLITCHES[i];
			option.innerHTML = Glitch.DEFAULT_GLITCHES[i];
			dropdown.appendChild(option);
		}
		
		var input = document.createElement("input");
		input.type = "submit";
		input.value = "Add Glitch";
		input.onclick = function(ev){
			var e = dropdown;
			var glitch_name = e.options[e.selectedIndex].value;
			var glitch = eval("new " + glitch_name + "()");
			level.room.AddGlitch(glitch);
			
			refreshGlitchList();
		};
		input.style.margin = "5px";
		
		var center = document.createElement("center");
		center.appendChild(input);
		
		div.appendChild(text);
		div.appendChild(dropdown);
		div.appendChild(document.createElement("br"));
		div.appendChild(center);
		
		Dialog.AddElement(div);
		dropdown.focus();
	}
}