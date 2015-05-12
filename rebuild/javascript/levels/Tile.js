function Slope(){}
Slope.FLAT = 0;
Slope.LOW_POS = 2;
Slope.MID_POS = 4;
Slope.HI_POS = 6;
Slope.LOW_NEG = -2;
Slope.MID_NEG = -4;
Slope.HI_NEG = -6;

function Collision(){}
Collision.GHOST = -1;
Collision.SOLID = 0;
Collision.SUPER_SOLID = 1;
Collision.FALLTHROUGH = 2;
Collision.KILL_PLAYER = 3;

function Tile(src, x, y, width, height, collision, slope, slope_index){
	GLObject.call(this, src, x, y, 0, 0, 0, width, height, width, height);
	this.type = "Tile";
	this.collision = defaultTo(collision, Collision.GHOST);
	this.slope = defaultTo(slope, Slope.FLAT);
	this.slope_index = defaultTo(slope_index, 0);
	switch (this.slope){
		case Slope.LOW_POS: case Slope.LOW_NEG:
			this.slope_index %= 4;
			break;
		case Slope.MID_POS: case Slope.MID_NEG:
			this.slope_index %= 2;
			break;
		case Slope.HI_POS: case Slope.HI_NEG:
			this.slope_index %= 4;
			break;
		default:
			this.slope_index %= 1;
	}
	
	this.setSideHeights();
}
extend(GLObject, Tile);

Tile.prototype.isSolid = function(){
	return (this.collision === Collision.SOLID || this.collision === Collision.SUPER_SOLID);
}
Tile.prototype.isPartiallySolid = function(){
	return (this.collision === Collision.FALLTHROUGH);
}

Tile.prototype.setSideHeights = function(){
	var height_offset = Math.tan(degToRad(this.slope)) * Game.TILE_SIZE;
	
	switch (this.slope){
		case Slope.LOW_POS: case Slope.MID_POS: case Slope.HI_POS:
			this.height_offsets = {
				left: Game.TILE_SIZE - (this.slope_index * height_offset),
				right: Game.TILE_SIZE - ((this.slope_index + 1) * height_offset)
			};
			break;
		case Slope.LOW_NEG: case Slope.MID_NEG: case Slope.HI_NEG:
			this.height_offsets = {
				left: Game.TILE_SIZE - (this.slope_index * height_offset),
				right: Game.TILE_SIZE - ((this.slope_index * height_offset))
			};
			break;
		case Slope.FLAT:
		default:
			this.height_offsets = { left: 0, right: 0};
			break;
	}
}

Tile.prototype.render = function(){
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