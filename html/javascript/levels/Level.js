function Level(canvas, text_canvas, bg_canvas, input, init_empty_room){
	this.text_ctx = text_canvas.getContext("2d");
	this.bg_ctx = bg_canvas.getContext("2d");
	this.level_name = "insert_level_name";
	
	this.player = new Player(0, 152);
	this.camera = new Camera(this);
	this.camera.Follow(this.player);
	
	this.start_index = {y: 0, x: 0, z: 0};
	this.room_index = {y: 0, x: 0, z: 0};
	this.delayed_room_set = false;
	this.room = undefined;
	this.rooms = {};
	
	this.architect = new LevelArchitect(canvas, input, this);
	
	this.paused = false;
	this.creating_room = false;
	
	this.soundscape = Soundscape.create_chordwork();
	
	if (init_empty_room === undefined) init_empty_room = false;
	if (init_empty_room){
		this.SetRoomAt(0, 0, 0, new Room(null, 0, 0, 0, 320, 240, 2, true));
		this.SetRoom(0, 0, 0);
		this.delayed_room_set = true;
	}
}
Level.prototype.pause = function(){
	this.paused = true;
}
Level.prototype.resume = function(){
	this.paused = false;
}
Level.prototype.togglePause = function(){
	this.paused = !this.paused;
}

Level.prototype.Export = function(){
	//normal entity Export functions will return objects.
	//room returns the collection of objects as json
	//level returns an object consisting of the collection of room jsons and an additional json object
	//containing additional objects and properties for the level
	
	var room_jsons = [];
	
	//other things to save for the level!!!
	var etc = {room_indices: []};
	
	var i_keys = getObjectKeys(this.rooms);
	var j_keys;
	var k_keys;
	for (var i = 0; i < i_keys.length; i++){
		var room_row = [];
		ikey = i_keys[i];
		j_keys = getObjectKeys(this.rooms[ikey]);
		for (var j = 0; j < j_keys.length; j++){
			var room_z_row = [];
			jkey = j_keys[j];
			k_keys = getObjectKeys(this.rooms[ikey][jkey]);
			for (var k = 0; k < k_keys.length; k++){
			  kkey = k_keys[k];
				var room = this.rooms[ikey][jkey][kkey];
				if (room.constructor.name === "RoomIllusion") continue;
				
				//var room_json = JSON.stringify(room.Export());
				room_z_row.push(room.Export());
				etc.room_indices.push({y:ikey, x:jkey, z:kkey});
			}
			room_row.push(room_z_row);
		}
		room_jsons.push(room_row);
	}
	etc.start_index = this.start_index;
	
	
	return {rooms: room_jsons, etc: JSON.stringify(etc)};
}

Level.Import = function(obj, canvas, text_canvas, bg_canvas, input){
	var level = new Level(canvas, text_canvas, bg_canvas, input);
	level.level_name = obj.level_name;
	for (var i = 0; i < obj.rooms.length; i++){
		var room = obj.rooms[i];
		level.SetRoomAt(room.y, room.x, room.z, Room.Import(room, level.player));
	}
	
	//other things to load for the level!!!
	level.start_index = obj.etc.start_index;
	level.SetRoom(level.start_index.y, level.start_index.x, level.start_index.z);
	
	return level;
}

Level.prototype.update = function(delta, input){
  if (this.delayed_room_set){
    this.delayed_room_set = false;
    this.InitNewRoom(this.room_index.y, this.room_index.x, this.room_index.z);
  }
  
	this.detectInput(delta, input);
	if (!this.paused && !this.creating_room){
		this.room.update(delta);
		this.player = this.room.player;
		this.camera.Follow(this.player);
		this.camera.update(this.room);
		
		if (this.spoken_text !== null && this.spoken_text !== undefined && this.spoken_text.length > 0){
			this.speech_timer+=delta;
			if (this.speech_timer > this.speech_time_limit){
				this.speech_timer = 0;
				this.Speak(null);
			}
		}
	}
}

Level.prototype.render = function(){
	this.room.render(this.camera, this.bg_ctx);
	this.render_speech();
	this.architect.render();
}

Level.prototype.Speak = function(text, timer){
	this.speech_timer = 0;
	this.speech_time_limit = timer;
	this.spoken_text = text;
}

Level.prototype.IsPlayerOnBottomScreenHalf = function(){
	if (this.player.y + this.player.bb > this.camera.y + this.camera.height/2)
		return true;
	return false;
}

Level.prototype.render_speech = function(){
	var speech_height = 144;
	var border_size = 4;
	var padding = 16;
	var txt_padding = 12;
	
	var ctx = this.text_ctx;

	ctx.clearRect(0, 0, Game.GAME_WIDTH, Game.GAME_HEIGHT);
	if (this.spoken_text !== null && this.spoken_text !== undefined && this.spoken_text.length > 0){
		var h = 0;
		if (this.IsPlayerOnBottomScreenHalf())
			h = (-1)*(Game.GAME_HEIGHT/1.5)+8;
		
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(
			padding,
			h + Game.GAME_HEIGHT-speech_height-padding,
			Game.GAME_WIDTH-(padding*2),
			speech_height
		);
		ctx.fillStyle = "#000000";
		ctx.fillRect(
			padding+border_size,
			h + Game.GAME_HEIGHT-speech_height-padding+border_size,
			Game.GAME_WIDTH-((padding+border_size)*2),
			speech_height-(border_size*2)
		);
	
		var fs = 32;
		ctx.font = fs + "px pixelFont";
		ctx.fillStyle = "#ffffff";
		ctx.strokeStyle = "#ffffff";
		var texts = this.spoken_text.split("\n");
		for (var i = 0; i < texts.length; i++){
			ctx.fillText(texts[i],
				padding+border_size+txt_padding,
				h + (fs*i)+Game.GAME_HEIGHT-speech_height+border_size+txt_padding,
				Game.GAME_WIDTH-(2*(padding+border_size+txt_padding)));
		}
	}
}

Level.prototype.detectInput = function(delta, input){
	this.architect.detectKeyInput(input);
	
	if (this.paused) return;
	
	if (input.IsKeyDown(">", "d")){
		this.player.MoveRight();
	}
	else if (input.IsKeyDown("<", "a")){
		this.player.MoveLeft();
	}
	
	if (input.IsKeyPressed(" ")){
		this.player.StartJump(delta);
	}
	else if (input.IsKeyDown(" ")){
		this.player.Jump(delta);
	}
	else if (input.IsKeyUp(" ")){
		this.player.StopJump(delta);
	}

	/*if (this.camera.view === "perspective"){
		if (input.IsKeyDown("^", "w")){
			this.player.MoveBack();
		}
		else if (input.IsKeyDown("V", "s")){
			this.player.MoveForward();
		}
	}*/
	if (input.IsKeyDown("V", "s")){
		this.player.PressDown();
	}
}

Level.prototype.ChangeRoomTeleport = function(y_inc, x_inc, z_inc, delay){
	//y_inc, x_inc, and z_inc should only be -1, 0, or 1
	//and only one should be nonzero per call
	//else use SetRoom directly (doors?)
	
  	this.SetRoom(
	    this.room_index.y+y_inc,
	    this.room_index.x+x_inc,
	    this.room_index.z+z_inc,
	    delay,
	    function(){}
  	);
}
Level.prototype.ChangeRoomWrap = function(y_inc, x_inc, z_inc, delay){
  var space = 8;
  if (x_inc > 0)
  	this.player.x = space;
  else if (x_inc < 0)
  	this.player.x = this.room.width-this.player.rb-space;
  if (y_inc > 0)
  	this.player.y = space;
  else if (y_inc < 0)
  	this.player.y = this.room.height-this.player.bb-space;
}
Level.prototype.ChangeRoomProper = function(y_inc, x_inc, z_inc, delay){
	//y_inc, x_inc, and z_inc should only be -1, 0, or 1
	//and only one should be nonzero per call
	//else use SetRoom directly (doors?)
	
	var old_room = this.room;
	
  	this.SetRoom(
	    this.room_index.y+y_inc,
	    this.room_index.x+x_inc,
	    this.room_index.z+z_inc,
	    delay,
	    function(old_room, room){
	    	var space = 4;
		  	if (x_inc > 0)
			  	this.player.x = space;
		  	else if (x_inc < 0)
		  		this.player.x = room.width-this.player.rb-space;
			else{
				this.player.x = (this.player.x / old_room.width) * room.width;
				if (this.player.x < 0) 
					this.player.x = space;
				if (this.player.x + this.player.width > room.width)
					this.player.x = room.width - this.player.width - space;
			}
			
		  	if (y_inc > 0)
		  		this.player.y = space;
		  	else if (y_inc < 0)
		  		this.player.y = room.height-this.player.height-space;
			else{
				this.player.y = (this.player.y / old_room.height) * room.height;
				if (this.player.y < 0)
					this.player.y = space;
				if (this.player.y + this.player.height > room.height)
					this.player.y = room.height - this.player.height - space;
			}
	    }.bind(this, old_room)
  	);
}
Level.prototype.ChangeRoom = Level.prototype.ChangeRoomProper;

Level.prototype.CreateNewRoom = function(y, x, z, delay, callback){
	this.architect.room_option.onContextMenu(this, function(room){
	  this.rooms[y][x][z] = room;
	  room.y = y;
	  room.x = x;
	  room.z = z;
	  room.InitFloor();
	  this.SetRoom(y, x, z);
	  this.resume();
	  this.creating_room = false;
	  
	  this.delayed_room_set = delay;
	  if (callback !== undefined)
	    callback(room);
	}.bind(this));
	this.creating_room = true;
}

Level.prototype.SetRoom = function(y, x, z, delay, callback){
	if (delay === undefined)
    	delay = false;
    
  if (this.rooms[y] === undefined){
  	this.rooms[y] = [];
  }
  if (this.rooms[y][x] === undefined){
  	this.rooms[y][x] = [];
  }
  if (this.rooms[y][x][z] === undefined && !this.creating_room){
    this.delayed_room_set = false;
    this.CreateNewRoom(y, x, z, delay, callback);
    return;
  }

	this.delayed_room_set = delay;
	
	var room = this.rooms[y][x][z];
	
	if (!delay){
	  	this.InitNewRoom(y, x, z);
	}
	this.room_index.y = y;
	this.room_index.x = x;
	this.room_index.z = z;
	
	if (callback !== undefined)
	  callback(room);
}
Level.prototype.SetRoomAt = function(y, x, z, room){
	if (this.rooms[y] === undefined)
		this.rooms[y] = [];
	if (this.rooms[y][x] === undefined)
		this.rooms[y][x] = [];
	this.rooms[y][x][z] = room;
}

Level.prototype.InitNewRoom = function(y, x, z){
  if (this.room !== undefined){
  	try{
  	  this.room.glitches[this.room.glitch_index].RevertRoom(this.room);
  	}catch(e){}
  	this.player = this.room.player;
	this.room.player = undefined;
  }

  this.room = this.rooms[y][x][z];
  this.room.Init(this.player, this);
  
  this.room.SetGlitchIndex(this.room.glitch_index);
}