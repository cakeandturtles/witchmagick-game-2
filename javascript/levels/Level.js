function Level(canvas, input){
	this.ctx2d = canvas.getContext("2d");
	this.level_name = "insert_level_name";
	
	this.player = new Player(0, 152);
	this.camera = new Camera();
	this.camera.Follow(this.player);
	
	this.start_index = {y: 0, x: 0, z: 0};
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
		var room = JSON.parse(obj.rooms[i]);
		level.SetRoomAt(room.y, room.x, room.z, Room.Import(room));
	}
	
	//other things to load for the level!!!
	level.start_index = obj.etc.start_index;
	level.SetRoom(level.start_index.y, level.start_index.x, level.start_index.z);
	
	return level;
}

Level.prototype.SetRoom = function(y, x, z){
	try{
		if (this.room !== undefined)
			this.room.player = undefined;
		this.room = this.rooms[y][x][z];
		this.room.SetPlayer(this.player);
	}catch(err){ console.log(err); }
}
Level.prototype.SetRoomAt = function(y, x, z, room){
	if (this.rooms[y] === undefined)
		this.rooms[y] = [];
	if (this.rooms[y][x] === undefined)
		this.rooms[y][x] = [];
	this.rooms[y][x][z] = room;
}

Level.prototype.update = function(delta, input){
	this.detectInput(delta, input);
	if (!this.paused){
		this.room.update(delta);
		this.player = this.room.player;
		this.camera.Follow(this.player);
	}
}

Level.prototype.render = function(){
	this.room.render(this.camera);
	this.architect.render();
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

	if (this.camera.view === "perspective"){
		if (input.IsKeyDown("^", "w")){
			this.player.MoveBack();
		}
		else if (input.IsKeyDown("V", "s")){
			this.player.MoveForward();
		}
	}
}