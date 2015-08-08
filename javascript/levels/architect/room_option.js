function RoomOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-room", "option_room.png", "trans.png");
	
	this.is_selectable = false;
	this.is_toggleable = true;
}
extend(Option, RoomOption);

RoomOption.prototype.onContextMenu = function(level, new_room_callback){
  var new_room = false;
  var room;
  if (new_room_callback !== undefined) new_room = true;
  var text = "room manager";
  
  if (new_room){
    text = "new room?";
    room = new Room(level.player, 0, 0, 0, 320, 240, 2, true);
  }else{
    room = this.architect.level.room;
  }
  
  var self = this;
	if (hasClass(this.dom, "selected")){
		Dialog.Close();
		addClass(this.dom, "selected");
	}else{
		level.pause();
		
		Dialog.Alert("", text, function(){
		  if (new_room)
		    new_room_callback(room);
			this.architect.tryResume();
			removeClass(this.dom, "selected");
		}.bind(this));
		
		//WIDTH
		var div = document.createElement("div");
		var text = document.createTextNode("width: ");
		var input = document.createElement("input");
		input.type = "number";
		input.value = this.architect.level.room.width;
		input.onchange = function(){
		    if (this.value < Room.STD_WIDTH) this.value = Room.STD_WIDTH;
		    //this.value = (~~(this.value / Room.STD_WIDTH) * Room.STD_WIDTH);
		    
		    room.width = this.value;
		}
		div.appendChild(text);
		div.appendChild(input);
		div.appendChild(document.createElement("br"));
		
		//HEIGHT
		text = document.createTextNode("height: ");
		input = document.createElement("input");
		input.type = "number";
		input.value = this.architect.level.room.height;
		input.onchange = function(){
		    if (this.value < Room.STD_HEIGHT) this.value = Room.STD_HEIGHT;
		    //this.value = (~~(this.value / Room.STD_HEIGHT) * Room.STD_HEIGHT);
		    
		    room.height = this.value;
		}
		div.appendChild(text);
		div.appendChild(input);
		div.appendChild(document.createElement("br"));
		
		//ZOOM
		text = document.createTextNode("zoom: ");
		input = document.createElement("input");
		input.type = "number";
		input.value = this.architect.level.room.zoom;
		input.oninput = function(){
		    if (this.value < 1) this.value = 1;
		    if (this.value > 8) this.value = 8;
		    
		    room.zoom = this.value;
		}
		div.appendChild(text);
		div.appendChild(input);
		div.appendChild(document.createElement("br"));
		div.appendChild(document.createElement("br"));
		
		if (!new_room){
  		//RESET ROOM TO ORIGINAL POSITIONS OF GLITCHES/ENTITIES
  		input = document.createElement("input");
  		input.type = "submit";
  		input.value = "reset room";
  		div.appendChild(input);
  		div.appendChild(document.createElement("br"));
  		
  		//MOVE OFFSCREEN ITEMS BACK ON SCREEN
  		input = document.createElement("input");
  		input.type = "submit";
  		input.value = "move offscreen items";
  		div.appendChild(input);
  		div.appendChild(document.createElement("br"));
  		
  		//DELETE ANY OFFSCREEN TILES
  		input = document.createElement("input");
  		input.type = "submit";
  		input.value = "delete offscreen tiles";
  		div.appendChild(input);
		}
		
		Dialog.AddElement(div);
	}
}