Game.prototype.start = function(){
	this.ctx = this.canvas.getContext('2d');
	this.canvas.width = Game.CANVAS_WIDTH;
	this.canvas.height = Game.CANVAS_HEIGHT;
	
	this.room = new Room(
		Game.CANVAS_WIDTH/2, 
		Game.CANVAS_HEIGHT/2
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
	
	this.input_manager.Update(delta, this.room.player);
	this.room.Update(delta);
}

Game.prototype.render = function(){	
	//draw the game
	sharpen(this.ctx);
	this.ctx.fillStyle = "#000000";
	this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	
	this.room.Render(this.ctx);
}