var Triangle = function(x, y, z, lb, tb, rb, bb){	
	GLObject.call(this, "blank.png", x, y, -16, 0, 0, 16, 16, 16, 16);
	
	this.type = "Triangle";
}
extend(GLObject, Triangle);

Triangle.prototype.initBuffers = function(){
	this.vertex_position_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_position_buffer);
	var vertices = [
		0.0, 0.0,  0.0,
		this.width, 0.0,  0.0,
		this.width/2,  this.height,  0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vertex_position_buffer.itemSize = 3;
	this.vertex_position_buffer.numItems = 3;
	
	this.vertex_color_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_color_buffer);
	var colors = [
		0.0, 1.0, 1.0,
		1.0, 0.0, 1.0,
		1.0, 1.0, 0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	this.vertex_color_buffer.itemSize = 3;
	this.vertex_color_buffer.numItems = 3;

	this.vertex_texture_coord_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coord_buffer);
	var textureCoords = [
	  0.0, 0.0,
	  1.0, 0.0,
	  0.5, 1.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	this.vertex_texture_coord_buffer.itemSize = 2;
	this.vertex_texture_coord_buffer.numItems = 3;

	this.vertex_index_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertex_index_buffer);
	var triangleVertexIndices = [
		0, 1, 2
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleVertexIndices), gl.STATIC_DRAW);
	this.vertex_index_buffer.itemSize = 1;
	this.vertex_index_buffer.numItems = 3;
}

Triangle.prototype.update = function(delta, room){
	this.rotations[1] += (3 * delta);
}