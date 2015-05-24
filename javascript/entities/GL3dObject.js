function GL3dObject(src, x, y, z, lb, tb, fb, rb, bb, zb, width, height, depth){		
	this.depth = defaultTo(depth, 16);
	
	GLObject.call(this, src, x, y, z, lb, tb, rb, bb, width, height);
	this.fb = defaultTo(fb, 0);
	this.zb = defaultTo(zb, -16);
}
extend(GLObject, GL3dObject);

GL3dObject.prototype.initBuffers = function(){
	this.vertex_position_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_position_buffer);
	var vertices = [
		// front face
		0.0, 0.0,  0.0,
		this.width, 0.0,  0.0,
		this.width, this.height,  0.0,
		0.0,  this.height,  0.0,
		// back face
		0.0, 0.0, -this.depth,
		0.0,  this.height, -this.depth,
		this.width,  this.height, -this.depth,
		this.width, 0.0, -this.depth,
		// top face
		0.0,  this.height, -this.depth,
		0.0,  this.height,  0.0,
		this.width,  this.height,  0.0,
		this.width,  this.height, -this.depth,
		// bottom face
		0.0, 0.0, -this.depth,
		this.width, 0.0, -this.depth,
		this.width, 0.0,  0.0,
		0.0, 0.0,  0.0,
		// right face
		this.width, 0.0, -this.depth,
		this.width,  this.height, -this.depth,
		this.width,  this.height,  0.0,
		this.width, 0.0,  0.0,
		// left face
		0.0, 0.0, -this.depth,
		0.0, 0.0,  0.0,
		0.0,  this.height,  0.0,
		0.0,  this.height, -this.depth
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vertex_position_buffer.itemSize = 3;
	this.vertex_position_buffer.numItems = 24;
	
	//create normal buffer for CUBE!
	this.vertex_normal_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_normal_buffer);
	var vertexNormals = [
		// Front face
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,

		// Back face
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,

		// Top face
		 0.0,  1.0,  0.0,
		 0.0,  1.0,  0.0,
		 0.0,  1.0,  0.0,
		 0.0,  1.0,  0.0,

		// Bottom face
		 0.0, -1.0,  0.0,
		 0.0, -1.0,  0.0,
		 0.0, -1.0,  0.0,
		 0.0, -1.0,  0.0,

		// Right face
		 1.0,  0.0,  0.0,
		 1.0,  0.0,  0.0,
		 1.0,  0.0,  0.0,
		 1.0,  0.0,  0.0,

		// Left face
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
	this.vertex_normal_buffer.itemSize = 3;
	this.vertex_normal_buffer.numItems = 24;
	
	//create color buffer for CUBE!
	this.vertex_color_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_color_buffer);
	var colors = [
		[1.0, 1.0, 1.0],	//front face	(white)
		[0.0, 0.0, 1.0],	//back face		(blue)
		[0.0, 1.0, 0.0],	//top face		(green)
		[1.0, 1.0, 0.0],	//bottom face	(yellow)
		[1.0, 0.0, 1.0],	//right face	(magenta)
		[1.0, 0.0, 0.0]		//left face		(red)
	];
	var unpackedColors = [];
	for (var i in colors){
		var color = colors[i];
		for (var j = 0; j < 4; j++){
			unpackedColors = unpackedColors.concat(color);
		}
	}
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
	this.vertex_color_buffer.itemSize = 3;
	this.vertex_color_buffer.numItems = 24;
	
	this.initTextureCoords();
	
	//Finally, define the element array buffer for the CUBE
	this.vertex_index_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertex_index_buffer); //not gl.ARRAY_BUFFER!!!!!!!!
	//using this to take the position buffer above, and construct each face using the four vertices (have to do this because webgl deals in triangles, and so we have to specify two triangles while sharing the diagonal vertices to make each cube face and not replicate vertices
	var cubeVertexIndices = [
		0, 1, 2,		0, 2, 3,	//front face
		4, 5, 6,		4, 6, 7,	//back face
		8, 9, 10, 		8, 10, 11,	//top face
		12, 13, 14,		12, 14, 15,	//bottom face
		16, 17, 18,		16, 18, 19,	//right face
		20, 21, 22,		20, 22, 23	//left face
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
	this.vertex_index_buffer.itemSize = 1;
	this.vertex_index_buffer.numItems = 36;
}

GL3dObject.prototype.initTextureCoords = function(){
	this.vertex_texture_coord_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coord_buffer);
	var textureCoords = [
	  // front face
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,  
		0.0, 1.0, 
		// back face
		1.0, 0.0,
		1.0, 1.0,  
		0.0, 1.0, 
		0.0, 0.0,
		// top face  
		0.0, 1.0, 
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		// bottom face
		1.0, 1.0,  
		0.0, 1.0, 
		0.0, 0.0,
		1.0, 0.0,
		// right face
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0, 
		0.0, 0.0,  
		// left face
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,  
		0.0, 1.0, 
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	this.vertex_texture_coord_buffer.itemSize = 2;
	this.vertex_texture_coord_buffer.numItems = 24;
}

GL3dObject.prototype.update = function(delta, room){
	this.rotations[0] += (1 * delta);
	this.rotations[1] += (2 * delta);
	//this.rotations[2] += (2 * delta);
}

GL3dObject.prototype.render = function(camera){
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
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
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