function Game(canvas){
	this.room = new Room();
	this.camera = new Camera();
	
	this.architect = new LevelArchitect(canvas, this, this.room);
	
	this.keys_down = {};
	this.keys_up = {};
	this.keys_pressed = {};
	window.onkeydown = function(e){
		if (this.keys_down[e.keyCode] === undefined){
			this.keys_down[e.keyCode] = true;
			this.keys_pressed[e.keyCode] = true;
		}
	}.bind(this);
	window.onkeyup = function(e){
		delete this.keys_down[e.keyCode];
		this.keys_up[e.keyCode] = true;
	}.bind(this);
}
Game.TILE_SIZE = 8;

Game.prototype.update = function(delta){
	this.room.update(delta);
	
	if (this.keys_down[39] || this.keys_down[68]){
		this.room.player.MoveRight();
	}
	else if (this.keys_down[37] || this.keys_down[65]){
		this.room.player.MoveLeft();
	}
	
	if (this.keys_pressed[38] || this.keys_pressed[87]){
		this.room.player.StartJump(delta);
	}
	else if (this.keys_down[38] || this.keys_down[87]){
		this.room.player.Jump(delta);
	}
	else if (this.keys_up[38] || this.keys_up[87]){
		this.room.player.StopJump(delta);
	}
	/*if (e.keyCode === 40 || 83){
		//this.room.player.y++;
	}*/
	
	this.keys_up = {};
	this.keys_pressed = {};
}

Game.prototype.render = function(){	
	this.room.render(this.camera);
	this.architect.render();
}