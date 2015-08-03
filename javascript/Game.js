function Game(canvas, text_canvas){
	this.canvas = canvas;
	this.text_canvas = text_canvas;
	this.input = new Input();
	LevelLoader.Import("test_level", canvas, text_canvas, this.input, function(level){
		this.level = level;
		this.has_loaded = true;
	}.bind(this));
	
	this.has_loaded = false;
}

Game.prototype.NewLevel = function(){
	this.level = new Level(this.canvas, this.text_canvas, this.input, true);
}

Game.GAME_WIDTH = 640;
Game.GAME_HEIGHT = 512;
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