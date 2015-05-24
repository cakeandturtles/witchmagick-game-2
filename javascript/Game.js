function Game(canvas){
	this.input = new Input();
	this.level = new Level(canvas, this.input);
}
Game.TILE_SIZE = 8;

Game.prototype.update = function(delta){
	this.level.update(delta, this.input);
	this.input.update();
}

Game.prototype.render = function(){	
	this.level.render();
}