function Level(canvas, input){
	this.ctx2d = canvas.getContext("2d");
	
	this.player = new Player(0, 152);
	this.camera = new Camera();
	this.camera.Follow(this.player);
	this.room = new Room();
	this.rooms = [[[this.room]]];
	
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
	
	for (var i = 0; i < this.rooms.length; i++){
		var room_row = [];
		for (var j = 0; j < this.rooms[i].length; j++){
			var room_z_row = [];
			for (var k = 0; k < this.rooms[i][j].length; k++){
				var room_json = this.rooms[i][j][k].Export();
				room_z_row.push(room_json);
			}
			room_row.push(room_z_row);
		}
		room_jsons.push(room_row);
	}
	
	//other things to save for the level!!!
	var etc = {};
	
	return {rooms: room_jsons, etc: JSON.stringify(etc)};
}
Level.prototype.Import = function(){
}

Level.prototype.update = function(delta, input){
	if (!this.paused){
		this.detectInput(delta, input);
		this.room.update(delta, this.player);
	}
}

Level.prototype.render = function(){
	this.room.render(this.camera, this.player);
	this.architect.render();
}

Level.prototype.detectInput = function(delta, input){
	if (input.IsKeyDown(">", "d")){
		this.player.MoveRight();
	}
	else if (input.IsKeyDown("<", "a")){
		this.player.MoveLeft();
	}
	
	if (input.IsKeyPressed("x")){
		this.player.StartJump(delta);
	}
	else if (input.IsKeyDown("x")){
		this.player.Jump(delta);
	}
	else if (input.IsKeyUp("x")){
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