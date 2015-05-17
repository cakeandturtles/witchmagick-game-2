var GLObject = function(src, x, y, z, lb, tb, rb, bb, width, height){	
	this.type = "GLObject";
	this.x = x;
	this.y = y;
	this.z = defaultTo(z, -4.0);
	this.original_coords = [this.x, this.y, this.z];
	
	this.rotations = [0, 0, 0];
	
	this.lb = defaultTo(lb, 0);
	this.tb = defaultTo(tb, 0);
	this.fb = 0;
	this.rb = defaultTo(rb, 16);
	this.bb = defaultTo(bb, 16);
	this.zb = 0;
	
	this.width = defaultTo(width, 16);
	this.height = defaultTo(height, 16);
	
	this.src = src;
	this.initBuffers();
	this.initTexture("assets/images/" + this.src);
	
	this.spritesheet_coords = {x: 0, y: 0};
	
	this.visible = true;
	this.alpha = 1.0;
	this.hazardous = false;
}

GLObject.prototype.initBuffers = function(){
	this.vertex_position_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_position_buffer);
	var vertices = [
		// Front face
		0.0, 0.0,  0.0,
		this.width, 0.0,  0.0,
		0.0,  this.height,  0.0,
		this.width,  this.height,  0.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vertex_position_buffer.itemSize = 3;
	this.vertex_position_buffer.numItems = 4;
	
	this.vertex_normal_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_normal_buffer);
	var vertexNormals = [
		//Front face
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
	this.vertex_normal_buffer.itemSize = 3;
	this.vertex_normal_buffer.numItems = 4;
	
	this.vertex_color_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_color_buffer);
	var colors = [
		1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		1.0, 1.0, 1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	this.vertex_color_buffer.itemSize = 3;
	this.vertex_color_buffer.numItems = 4;

	this.vertex_texture_coord_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coord_buffer);
	var textureCoords = [
	  // Front face
	  0.0, 0.0,
	  1.0, 0.0,
	  0.0, 1.0,
	  1.0, 1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	this.vertex_texture_coord_buffer.itemSize = 2;
	this.vertex_texture_coord_buffer.numItems = 4;
}

GLObject.prototype.initTexture = function(src){
	this.texture = gl.createTexture();
	this.texture.image = new Image();
	this.texture.image.onload = function () {
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
	}.bind(this);

	this.texture.image.src = src;
}

GLObject.prototype.ResetPosition = function(){
	this.x = this.original_coords[0];
	this.y = this.original_coords[1];
	this.z = this.original_coords[2];
}

GLObject.prototype.update = function(delta, room){}

GLObject.prototype.render = function(camera){
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
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.BLEND);
	gl.disable(gl.DEPTH_TEST);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertex_position_buffer.numItems);
	mvPopMatrix();
}