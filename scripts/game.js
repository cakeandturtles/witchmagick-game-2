function Game(canvas){
	this.canvas = canvas;
}

Game.prototype.start = function(){
	this.ctx = this.canvas.getContext('2d');
	
	this.room = {
		player: new Player(CANVAS_WIDTH/4, CANVAS_HEIGHT/4)
		,camera: { x: 0, y: 0 }
	}
	
	this.corruption_manager = new Corruption(this.room);

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
}

Game.prototype.render = function(){	
	//draw the game
	sharpen(this.ctx);
	this.ctx.fillStyle = "#ff00ff";
	this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	
	this.room.player.Render(this.ctx, this.room.camera);
}