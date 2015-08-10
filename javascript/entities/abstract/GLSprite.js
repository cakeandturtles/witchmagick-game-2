function Facing(){}
Facing.LEFT = 0;
Facing.RIGHT = 1;
Facing.FORWARD = 2;
Facing.BACK = 3;

function GLSprite(img_name, x, y, lb, tb, rb, bb, width, height){
	GLObject.call(this, img_name, x, y, -4.0, lb, tb, rb, bb, width, height);
	
	this.facing = Facing.RIGHT;
	this.original_facing = this.facing;
	
	this.animation = new GLAnimation(1, 7);
}
extend(GLObject, GLSprite);

GLSprite.prototype.update = function(delta, room){
	this.animation.update(delta);
	GLObject.prototype.update.call(this, delta, room);
}

GLSprite.prototype.render = function(camera){
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coord_buffer);
	var textureCoords = this.animation.getTextureCoords(this.facing);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
		
	GLObject.prototype.render.call(this, camera);
}