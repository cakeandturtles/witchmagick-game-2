function Facing(){}
Facing.LEFT = 0;
Facing.RIGHT = 1;

function GLSprite(src, x, y, lb, tb, rb, bb){
	GLObject.call(this, src, x, y, 0, lb, tb, rb, bb);
	
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