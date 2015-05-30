function TileOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-tile", "option_tile.png", "tile.png");
	
	this.rb = Game.TILE_SIZE;
	this.bb = Game.TILE_SIZE;
	this.width = Game.TILE_SIZE;
	this.height = Game.TILE_SIZE;
	
	this.tile_placement_depth = 1;
}
extend(Option, TileOption);

TileOption.prototype.onContextMenu = function(level){
	var self = this;
	
	level.pause();
	Dialog.Alert("", "tile placement", function(){this.tryResume()}.bind(this.architect));
	
	var tile_placement_depth = document.createElement("div");
	var text = document.createTextNode("tile placement depth: " );
	var input = document.createElement("input");
	input.type = "number";
	input.value = this.tile_placement_depth;
	input.oninput = function(){
		var number = Number(this.value);
		if (number < 1) number = 1;
		self.tile_placement_depth = number;
		this.value = number;
	}
	input.style.width = "50px";
	tile_placement_depth.appendChild(text);
	tile_placement_depth.appendChild(input);
	
	//add the elements to the dialog
	Dialog.AddElement(tile_placement_depth);
}

TileOption.prototype.PlaceTiles = function(deleting, level){
	var x = this.x / Game.TILE_SIZE;
	var y = this.y / Game.TILE_SIZE;
	
	for (var i = 0; i < this.height / Game.TILE_SIZE; i++){
		for (var j = 0; j < this.width / Game.TILE_SIZE; j++){
			for (var k = level.camera.z; k > level.camera.z - this.tile_placement_depth*Game.TILE_SIZE; k-=Game.TILE_SIZE){
				if (!deleting){
					level.room.AddTile(y + i, x + j, k/Game.TILE_SIZE, new Tile("tile.png", this.x + j*Game.TILE_SIZE, this.y + i*Game.TILE_SIZE, k, Game.TILE_SIZE, Game.TILE_SIZE, Game.TILE_SIZE, Collision.SOLID), true);
				}else{
					level.room.RemoveTile(y + i, x + j, k/Game.TILE_SIZE, true);
				}
			}
		}
	}
}

TileOption.prototype.mouseDown = function(x, y, is_right_mb, level){
	if (is_right_mb){
		level.room.DeaggregateTiles();
	}
	this.PlaceTiles(is_right_mb, level);
}

TileOption.prototype.mouseUp = function(x, y, is_right_mb, level){
	level.room.AggregateTiles();
}

TileOption.prototype.mouseMove = function(x, y, is_right_mb, level, is_mouse_down){
	this.x = x;
	this.y = y;
	
	if (is_mouse_down){
		this.PlaceTiles(is_right_mb, level);
	}
}

TileOption.prototype.mouseScroll = function(x, y, is_right_mb, level, delta){
	//scroll up
	if (delta > 0){
		this.width -= Game.TILE_SIZE;
		if (this.width < Game.TILE_SIZE)
			this.width = Game.TILE_SIZE;
	}
	//scroll down
	else if (delta < 0){
		this.width += Game.TILE_SIZE
		if (this.width > Game.TILE_SIZE * 4)
			this.width = Game.TILE_SIZE * 4;
	}
	this.height = this.width;
}

TileOption.prototype.render = function(){
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