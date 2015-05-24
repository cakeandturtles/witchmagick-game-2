var Triangle = function(x, y, z, lb, tb, rb, bb){	
	GLObject.call(this, "blank.png", x, y, 0, 0, 0, 16, 16, 16, 16);
	
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
	
	this.vertex_normal_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_normal_buffer);
	var normals = [
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	this.vertex_normal_buffer.itemSize = 3;
	this.vertex_normal_buffer.numItems = 3;
	
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
}

Triangle.prototype.update = function(delta, room){
	this.rotations[1] += (5 * delta);
}

Triangle.prototype.render = function(camera){
	mvPushMatrix();
	mat4.translate(mvMatrix, [this.x, -this.height-this.y, this.z]);
	
	mat4.translate(mvMatrix, [this.lb + this.rb / 2, 0, 0]);
	mat4.rotateX(mvMatrix, degToRad(this.rotations[0]));
	mat4.rotateY(mvMatrix, degToRad(this.rotations[1]));
	mat4.rotateZ(mvMatrix, degToRad(this.rotations[2]));
	mat4.translate(mvMatrix, [-(this.lb + this.rb / 2), 0, 0]);
	
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
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	gl.uniform1f(shaderProgram.alpha, this.alpha);
	
	setMatrixUniforms();
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	
	gl.drawArrays(gl.TRIANGLES, 0, this.vertex_position_buffer.numItems);
	mvPopMatrix();
}