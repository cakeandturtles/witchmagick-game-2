Game.debug_obj = {};
Game.Debug = function(x){
	console.log("SETTING DEBUG OBJ TO: " + x);
	Game.debug_obj = x;
};

Game.prototype.start = function(){
	this.canvas.width = Game.CANVAS_WIDTH;
	this.canvas.height = Game.CANVAS_HEIGHT;
	
	this.room = new Room(
		Game.CANVAS_WIDTH/2, 
		Game.CANVAS_HEIGHT/2,
		Game.CANVAS_WIDTH/2
	);
	
	this.input_manager = new InputManager();
	var self = this;
	window.onkeydown = function(e){
		self.input_manager.key_manager.KeyDown(e);
	}
	window.onkeyup = function(e){
		self.input_manager.key_manager.KeyUp(e);
	}
	
	this.corruption_manager = new Corruption(this.room);
	this.canvas.onmousedown = function(e){
		self.corruption_manager.canvasMouseDown(e);
	}

	this.tick();
}

Game.prototype.tick = function(){
	this.update();
	this.render();
	requestAnimFrame(function(){
		this.tick();
	}.bind(this));
}

Game.prototype.update = function(){
	var delta = 1.5;
	
	this.room.Update(delta, this.input_manager);/**/
}

Game.prototype.render = function(){	
	//draw the game
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	
	this.room.Render();
}