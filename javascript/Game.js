function Game(canvas){
	this.input = new Input();
	LevelLoader.Import("test_level", canvas, this.input, function(level){
		this.level = level;
		this.has_loaded = true;
	}.bind(this));
	
	this.has_loaded = false;
}
Game.TILE_SIZE = 8;

Game.prototype.update = function(delta){
	if (!this.has_loaded) return;
	
	this.level.update(delta, this.input);
	this.input.update();
}

Game.prototype.render = function(){	
	if (!this.has_loaded) return;

	this.level.render();
}