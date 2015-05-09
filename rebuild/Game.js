function Game(){
	this.room = new Room();
	
	this.keys_down = {};
	this.keys_up = {};
	this.keys_pressed = {};
	window.onkeydown = function(e){
		this.keys_down[e.keyCode] = true;
		this.keys_pressed[e.keyCode] = true;
	}.bind(this);
	window.onkeyup = function(e){
		delete this.keys_down[e.keyCode];
		this.keys_up[e.keyCode] = true;
	}.bind(this);
}
Game.TILE_SIZE = 8;

Game.prototype.update = function(delta){
	this.room.update(delta);
	
	if (this.keys_down[39]){
		this.room.player.MoveRight();
	}
	else if (this.keys_down[37]){
		this.room.player.MoveLeft();
	}
	
	/*if (e.keyCode === 38){
		//this.room.player.y--;
	}
	else if (e.keyCode === 40){
		//this.room.player.y++;
	}*/
	
	this.keys_up = {};
	this.keys_pressed = {};
}

Game.prototype.render = function(){
	this.room.render();
}