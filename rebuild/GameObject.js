var GameObject = function(){
	this.initBuffers();
	this.initTexture();
	
	this.x = 0;
	this.y = 0;
	
	window.onkeydown = function(e){
		if (e.keyCode === 39){
			player.x++;
		}
		else if (e.keyCode === 37){
			player.x--;
		}
		if (e.keyCode === 38){
			player.y--;
		}
		else if (e.keyCode === 40){
			player.y++;
		}
	}
}

GameObject.prototype.initBuffers = function(){
	this.vertex_position_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_position_buffer);
	var vertices = [
		// Front face
		0.0, 0.0,  0.0,
		16.0, 0.0,  0.0,
		16.0,  16.0,  0.0,
		0.0,  16.0,  0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vertex_position_buffer.itemSize = 3;
	this.vertex_position_buffer.numItems = 4;

	this.vertex_texture_coord_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coord_buffer);
	var textureCoords = [
	  // Front face
	  0.0, 0.0,
	  1.0, 0.0,
	  1.0, 1.0,
	  0.0, 1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	this.vertex_texture_coord_buffer.itemSize = 2;
	this.vertex_texture_coord_buffer.numItems = 4;

	this.vertex_index_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertex_index_buffer);
	var cubeVertexIndices = [
		0, 1, 2,      0, 2, 3,    // Front face
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
	this.vertex_index_buffer.itemSize = 1;
	this.vertex_index_buffer.numItems = 6;
}

GameObject.prototype.initTexture = function(){
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

	this.texture.image.src = "sprite.png";
}

GameObject.prototype.render = function(){
	mat4.translate(mvMatrix, [this.x, -this.y, 0.0]);
	mat4.translate(mvMatrix, [8.0, 0.0, 0.0]);
	mat4.rotateY(mvMatrix, yRot);
	mat4.translate(mvMatrix, [-8.0, 0.0, 0.0]);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_position_buffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertex_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coord_buffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertex_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertex_index_buffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, this.vertex_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
}