function LevelArchitect(canvas, game, room){
	GLObject.call(this, "tile.png", 0, 0, 0, 0, 0, Game.TILE_SIZE, Game.TILE_SIZE, Game.TILE_SIZE, Game.TILE_SIZE);
	this.type = "LevelArchitect";
	this.alpha = 0.5;
	
	this.game = game;
	this.room = room;
	this.is_mouse_down = false;
	this.deleting = false;
	
	canvas.onmousedown = this.mouseDown.bind(this);
	canvas.onmouseup = this.mouseUp.bind(this);
	canvas.onmousemove = this.mouseMove.bind(this);
	canvas.onmousewheel = this.mouseScroll.bind(this);
}
extend(GLObject, LevelArchitect);

LevelArchitect.prototype.PlaceTiles = function(){
	var y_index = this.y / Game.TILE_SIZE;
	var x_index = this.x / Game.TILE_SIZE;
	for (var i = 0; i < this.height / Game.TILE_SIZE; i++){
		for (var j = 0; j < this.width / Game.TILE_SIZE; j++){
			if (!this.deleting){
				this.room.AddTile(y_index + i, x_index + j, new Tile("tile.png", this.x + j*Game.TILE_SIZE, this.y + i*Game.TILE_SIZE, Game.TILE_SIZE, Game.TILE_SIZE, Collision.SOLID), true);
			}else{
				this.room.RemoveTile(y_index + i, x_index + j, true);
			}
		}
	}
}

LevelArchitect.prototype.mouseDown = function(e){
	this.is_mouse_down = true;
	this.deleting = false;
	if (e.which === 3)
		this.deleting = true;
	this.PlaceTiles();
}
LevelArchitect.prototype.mouseUp = function(e){
	this.is_mouse_down = false;
}
LevelArchitect.prototype.mouseMove = function(e){
	var mouseX = e.clientX + document.body.scrollLeft - 8;
	var mouseY = e.clientY + document.body.scrollTop - 8;
	var gridX = ~~(mouseX / (Game.TILE_SIZE * this.room.zoom));
	var gridY = ~~(mouseY / (Game.TILE_SIZE * this.room.zoom));
	
	this.x = gridX * Game.TILE_SIZE;
	this.y = gridY * Game.TILE_SIZE;
	
	if (this.is_mouse_down) this.PlaceTiles();
}
LevelArchitect.prototype.mouseScroll = function(e){
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	
	if (this.game.keys_down[90]){ //z for zoom
		if (delta > 0){ //scroll up
			this.room.zoom--;
			if (this.room.zoom < 1) this.room.zoom = 8;
		}
		else if (delta < 0){ //scroll down
			this.room.zoom++;
			if (this.room.zoom > 8) this.room.zoom = 1;
		}
	}
	else{
		//scroll up
		if (delta > 0){
			this.width -= Game.TILE_SIZE;
			if (this.width < Game.TILE_SIZE)
				this.width = Game.TILE_SIZE * 4;
		}
		//scroll down
		else if (delta < 0){
			this.width += Game.TILE_SIZE
			if (this.width > Game.TILE_SIZE * 4)
				this.width = Game.TILE_SIZE;
		}
		this.height = this.width;
	}
}

LevelArchitect.prototype.render = function(){	
	//adjust vertex positions
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_position_buffer);
	var vertices = [
		// Front face
		0.0, 0.0,  0.0,
		this.width, 0.0,  0.0,
		0.0,  this.height,  0.0,
		this.width,  this.height,  0.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	
	//adjust texture coords
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coord_buffer);
	var textureCoords = [
	  // Front face
	  0.0, 0.0,
	  1.0 / (Game.TILE_SIZE / this.width), 0.0,
	  0.0, 1.0 / (Game.TILE_SIZE / this.height),
	  1.0 / (Game.TILE_SIZE / this.width), 1.0 / (Game.TILE_SIZE / this.height),
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	
	GLObject.prototype.render.call(this);
}