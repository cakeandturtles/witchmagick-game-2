function Level(canvas, input){
	this.room_names = [];
	
	this.camera = new Camera();
	this.room = new Room();
	this.architect = new LevelArchitect(canvas, input, this);
}

Level.prototype.update = function(delta, input){
	this.detectInput(delta, input);
	this.room.update(delta);
}

Level.prototype.render = function(){
	this.room.render(this.camera);
	this.architect.render();
}

Level.prototype.detectInput = function(delta, input){
	if (input.IsKeyDown(">", "d")){
		this.room.player.MoveRight();
	}
	else if (input.IsKeyDown("<", "a")){
		this.room.player.MoveLeft();
	}
	
	if (input.IsKeyPressed("^", "w")){
		this.room.player.StartJump(delta);
	}
	else if (input.IsKeyDown("^", "w")){
		this.room.player.Jump(delta);
	}
	else if (input.IsKeyUp("^", "w")){
		this.room.player.StopJump(delta);
	}

	/*if (e.keyCode === 40 || 83){
		//this.room.player.y++;
	}*/
}