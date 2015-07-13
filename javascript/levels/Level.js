function Level(canvas, text_canvas, input){
	this.text_ctx = text_canvas.getContext("2d");
	this.level_name = "insert_level_name";
	
	this.player = new Player(0, 152);
	this.camera = new Camera(this);
	this.camera.Follow(this.player);
	
	this.start_index = {y: 0, x: 0, z: 0};
	this.room_index = {y: 0, x: 0, z: 0};
	this.delayed_room_set = false;
	this.room = undefined;
	this.rooms = [[[]]];
	
	this.architect = new LevelArchitect(canvas, input, this);
	
	this.paused = false;
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
	
	for (var i = 0; i < this.rooms.length; i++){
		var room_row = [];
		for (var j = 0; j < this.rooms[i].length; j++){
			var room_z_row = [];
			for (var k = 0; k < this.rooms[i][j].length; k++){
				var room_json = this.rooms[i][j][k].Export();
				room_z_row.push(room_json);
				etc.room_indices.push({y:i, x:j, z:k});
			}
			room_row.push(room_z_row);
		}
		room_jsons.push(room_row);
	}
	etc.start_index = this.start_index;
	
	
	return {rooms: room_jsons, etc: JSON.stringify(etc)};
}

Level.Import = function(obj, canvas, input){
	var level = new Level(canvas, input);
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

Level.prototype.ChangeRoom = function(y_inc, x_inc, z_inc, delay){
  this.SetRoom(
    this.room_index.y+y_inc,
    this.room_index.x+x_inc,
    this.room_index.z+z_inc,
    delay
  );
}

Level.prototype.SetRoom = function(y, x, z, delay){
  if (delay === undefined)
    delay = false;
	try{
	  
	  this.delayed_room_set = delay;
	  if (!delay){
		  this.InitNewRoom(y, x, z);
	  }
		this.room_index.y = y;
		this.room_index.x = x;
		this.room_index.z = z;
	}catch(err){ console.log(err); }
}
Level.prototype.SetRoomAt = function(y, x, z, room){
	if (this.rooms[y] === undefined)
		this.rooms[y] = [];
	if (this.rooms[y][x] === undefined)
		this.rooms[y][x] = [];
	this.rooms[y][x][z] = room;
	
	console.log(y + ", " + x + ", " +z);
	console.log(room);
}

Level.prototype.InitNewRoom = function(y, x, z){
  if (this.room !== undefined)
	  this.room.player = undefined;

  this.room = this.rooms[y][x][z];
  this.room.Init(this.player, this);
}

Level.prototype.update = function(delta, input){
  if (this.delayed_room_set){
    this.delayed_room_set = false;
    this.InitNewRoom(this.room_index.y, this.room_index.x, this.room_index.z);
  }
  
	this.detectInput(delta, input);
	if (!this.paused){
		this.room.update(delta);
		this.player = this.room.player;
		this.camera.Follow(this.player);
		
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
	this.room.render(this.camera);
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