function Game(canvas, text_canvas){
	this.input = new Input();
	LevelLoader.Import("test_level", canvas, text_canvas, this.input, function(level){
		this.level = level;
		this.has_loaded = true;
	}.bind(this));
	
	this.has_loaded = false;
}

Game.GAME_WIDTH = 640;
Game.GAME_HEIGHT = 480;
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