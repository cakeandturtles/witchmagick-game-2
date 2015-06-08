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

function Tile(x, y, z, width, height, depth, collision, slope, slope_index){
	GL3dObject.call(this, null, x, y, z, 0, 0, 0, width, height, -depth, width, height, depth);
	
	this.y_index = y / Game.TILE_SIZE;
	this.x_index = x / Game.TILE_SIZE;
	this.z_index = z / Game.TILE_SIZE;
	this.type = "Tile";
	this.collision = defaultTo(collision, Collision.SOLID);
	this.slope = defaultTo(slope, Slope.FLAT);
	this.slope_index = defaultTo(slope_index, 0);
	
	this.setSideHeights();
}
extend(GL3dObject, Tile);

Tile.prototype.Export = function(){
	//return a simplified object of the tile that will be used for saving to file
	//(only contain essential nonreplicatable information)
	var tile = {};
	tile.x = this.x;
	tile.y = this.y;
	tile.z = this.z;
	
	if (this.collision !== Collision.SOLID)
		tile.collision = this.collision;
	if (this.slope !== Slope.FLAT)
		tile.slope = this.slope;
	if (this.slope_index !== 0)
		tile.slope_index = this.slope_index;
	
	return tile;
}
Tile.Import = function(obj){
	var tile = new Tile(obj.x, obj.y, obj.z, Game.TILE_SIZE, Game.TILE_SIZE, Game.TILE_SIZE, obj.collision, obj.slope, obj.slope_index);
	
	return tile;
}


Tile.prototype.initTextureCoords = function(){
	this.vertex_texture_coord_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coord_buffer);
	var textureCoords = [
	  // front face
		0.0, 0.0,
		1.0 / (Game.TILE_SIZE / this.width), 0.0,
		1.0 / (Game.TILE_SIZE / this.width), 1.0 / (Game.TILE_SIZE / this.height),  
		0.0, 1.0 / (Game.TILE_SIZE / this.height), 
		// back face
		1.0 / (Game.TILE_SIZE / this.width), 0.0,
		1.0 / (Game.TILE_SIZE / this.width), 1.0 / (Game.TILE_SIZE / this.height),  
		0.0, 1.0 / (Game.TILE_SIZE / this.height), 
		0.0, 0.0,
		// top face  
		0.0, 1.0 / (Game.TILE_SIZE / this.depth), 
		0.0, 0.0,
		1.0 / (Game.TILE_SIZE / this.width), 0.0,
		1.0 / (Game.TILE_SIZE / this.width), 1.0 / (Game.TILE_SIZE / this.depth),
		// bottom face
		1.0 / (Game.TILE_SIZE / this.width), 1.0 / (Game.TILE_SIZE / this.depth),  
		0.0, 1.0 / (Game.TILE_SIZE / this.depth), 
		0.0, 0.0,
		1.0 / (Game.TILE_SIZE / this.width), 0.0,
		// right face
		1.0 / (Game.TILE_SIZE / this.depth), 0.0,
		1.0 / (Game.TILE_SIZE / this.depth), 1.0 / (Game.TILE_SIZE / this.height),
		0.0, 1.0 / (Game.TILE_SIZE / this.height), 
		0.0, 0.0,  
		// left face
		0.0, 0.0,
		1.0 / (Game.TILE_SIZE / this.depth), 0.0,
		1.0 / (Game.TILE_SIZE / this.depth), 1.0 / (Game.TILE_SIZE / this.height),  
		0.0, 1.0 / (Game.TILE_SIZE / this.height), 
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	this.vertex_texture_coord_buffer.itemSize = 2;
	this.vertex_texture_coord_buffer.numItems = 24;
}

Tile.prototype.isSolid = function(){
	return (this.collision === Collision.SOLID || this.collision === Collision.SUPER_SOLID);
}
Tile.prototype.isPartiallySolid = function(){
	return (this.collision === Collision.FALLTHROUGH);
}

Tile.prototype.setSideHeights = function(){
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

Tile.prototype.render = function(camera, texture){
	mvPushMatrix();
	mat4.translate(mvMatrix, [this.x, -this.height-this.y, this.z]);
	
	mat4.translate(mvMatrix, [this.lb + this.rb / 2, this.tb + this.bb / 2, this.fb + this.zb / 2]);
	mat4.rotateX(mvMatrix, degToRad(this.rotations[0]));
	mat4.rotateY(mvMatrix, degToRad(this.rotations[1]));
	mat4.rotateZ(mvMatrix, degToRad(this.rotations[2]));
	mat4.translate(mvMatrix, [-(this.lb + this.rb / 2), -(this.tb + this.bb / 2), -(this.fb + this.zb / 2)]);
	
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_position_buffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertex_position_buffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_normal_buffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.vertex_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_color_buffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
	this.vertex_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coord_buffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertex_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	gl.uniform1f(shaderProgram.alpha, this.alpha);
	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.disable(gl.BLEND);
	gl.enable(gl.DEPTH_TEST);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertex_index_buffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, this.vertex_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
	mvPopMatrix();
}