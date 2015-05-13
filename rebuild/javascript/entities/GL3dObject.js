function GL3dObject(src, x, y, z, lb, tb, fb, rb, bb, zb, width, height, depth){	
	this.fb = defaultTo(fb, 0);
	this.zb = defaultTo(zb, 16);
	
	this.depth = defaultTo(depth, 16);
	
	GLObject.call(this, src, x, y, z, lb, tb, rb, bb, width, height);
}
extend(GLObject, GL3dObject);

GL3dObject.prototype.initBuffers = function(){
	this.vertex_position_buffers = [gl.createBuffer()];
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_position_buffers[0]);
	var vertices = [
		// Front face
		0.0, 0.0,  0.0,									//front left bottom
		this.width, 0.0,  0.0,							//front right bottom
		0.0,  this.height,  0.0,						//front left top
		this.width,  this.height,  0.0,					//front right top
		//top face
		0.0, this.height, this.depth,					//back left top
		this.width, this.height, this.depth,			//back right top
		//zback face
		0.0, 0.0, this.depth,							//back left bottom
		this.width, 0.0, this.depth,					//back right bottom
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vertex_position_buffers[0].itemSize = 3;
	this.vertex_position_buffers[0].numItems = 8;
	
	this.vertex_position_buffers.push(gl.createBuffer());
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_position_buffers[1]);
	vertices = [
		//left face
		0.0, this.height, 0.0,							//front left top
		0.0, this.height, this.depth,					//back left top
		0.0, 0.0, 0.0,									//front left bottom
		0.0, 0.0, this.depth,							//back left bottom
		//bottom face
		this.width, 0.0, 0.0,							//front right bottom
		this.width, 0.0, this.depth,					//back right bottom
		//right face
		this.width, this.height, 0.0,					//front right top
		this.width, this.height, this.depth,			//back right top
		
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vertex_position_buffers[1].itemSize = 3;
	this.vertex_position_buffers[1].numItems = 8;
	
	
	this.vertex_color_buffers = [gl.createBuffer()];
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_color_buffers[0]);
	var colors = [
		//front face
		1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		//top face
		1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		//zback face
		1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	this.vertex_color_buffers[0].itemSize = 3;
	this.vertex_color_buffers[0].numItems = 8;
	
	this.vertex_color_buffers.push(gl.createBuffer());
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_color_buffers[1]);
	colors = [
		//left face
		1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		//bottom face
		1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		//right face
		1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	this.vertex_color_buffers[1].itemSize = 3;
	this.vertex_color_buffers[1].numItems = 8;
	

	this.vertex_texture_coord_buffers = [gl.createBuffer()];
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coord_buffers[0]);
	var texture_coords = [
		// Front face
		0.0, 0.0,
		1.0, 0.0,
		0.0,  1.0,
		1.0,  1.0,
		//top face
		0.0, 0.0,
		1.0, 0.0,
		//zback face
		0.0, 1.0,
		1.0, 1.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_coords), gl.STATIC_DRAW);
	this.vertex_texture_coord_buffers[0].itemSize = 2;
	this.vertex_texture_coord_buffers[0].numItems = 8;
	
	this.vertex_texture_coord_buffers.push(gl.createBuffer());
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coord_buffers[1]);
	texture_coords = [
		// left face
		0.0, 0.0,
		1.0, 0.0,
		0.0,  1.0,
		1.0,  1.0,
		//bottom face
		0.0, 0.0,
		1.0, 0.0,
		//right face
		0.0, 1.0,
		1.0, 1.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_coords), gl.STATIC_DRAW);
	this.vertex_texture_coord_buffers[1].itemSize = 2;
	this.vertex_texture_coord_buffers[1].numItems = 8;
}

GL3dObject.prototype.update = function(delta, room){
	this.rotations[0] += (1 * delta);
	this.rotations[1] += (2 * delta);
}

GL3dObject.prototype.render = function(){
	mvPushMatrix();
	mat4.translate(mvMatrix, [this.x, -this.height-this.y, this.z]);
	
	mat4.translate(mvMatrix, [this.lb + this.rb / 2, this.tb + this.bb / 2, this.fb + this.zb / 2]);
	mat4.rotateX(mvMatrix, degToRad(this.rotations[0]));
	mat4.rotateY(mvMatrix, degToRad(this.rotations[1]));
	mat4.rotateZ(mvMatrix, degToRad(this.rotations[2]));
	mat4.translate(mvMatrix, [-(this.lb + this.rb / 2), -(this.tb + this.bb / 2), -(this.fb + this.zb / 2)]);
	
	for (var i = 0; i < this.vertex_position_buffers.length; i++){
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_position_buffers[i]);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertex_position_buffers[i].itemSize, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_color_buffers[i]);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
		this.vertex_color_buffers[i].itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coord_buffers[i]);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertex_texture_coord_buffers[i].itemSize, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
		
		gl.uniform1f(shaderProgram.alpha, this.alpha);
		
		setMatrixUniforms();
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertex_position_buffers[i].numItems);
	}
	mvPopMatrix();
}