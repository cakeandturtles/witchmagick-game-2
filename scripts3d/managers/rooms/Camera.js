function Camera(eye, at){
	this.eye = eye;
	this.at = at;
	
	this.tracking_target = null;
}

Camera.prototype.Track = function(target){
	this.tracking_target = target;
}

Camera.prototype.StopTracking = function(){
	this.tracking_target = null;
}

Camera.prototype.Update = function(delta, room_width, room_height){
	var width = Game.CANVAS_WIDTH/this.zoom;
	var height = Game.CANVAS_HEIGHT/this.zoom;
	
	if (this.tracking_target !== null){
		var target = this.tracking_target;
		if (target.x < this.x+this.x_buffer)
			this.x = target.x-this.x_buffer;
		if (target.x+target.animation.frame_width > this.x+width-this.x_buffer)
			this.x = target.x+target.animation.frame_width-width+this.x_buffer;
		
		if (target.y < this.y+this.y_buffer)
			this.y = target.y-this.y_buffer;
		if (target.y+target.animation.frame_height > this.y+height-this.y_buffer)
			this.y = target.y+target.animation.frame_height-height+this.y_buffer;
	}
	
	//CORRECT IF YOU GET OFF THE EDGE OF THE ROOM
	if (this.x < 0) this.x = 0;
	if (this.x + width > room_width)
		this.x = room_width - width;
	if (this.y < 0) this.y = 0;
	if (this.y + height > room_height)
		this.y = room_height - height;
}

Camera.prototype.Render = function(){	
	var near = 0.1;
	var far = 100.0;
	
	var fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
	var aspect = Game.CANVAS_WIDTH / Game.CANVAS_HEIGHT;       // Viewport aspect ratio
	
	var up = vec3(0.0, 1.0, 0.0);
    var mvMatrix = lookAt(this.eye, this.at , up);
    var pMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv(gl.getUniformLocation( program, "uMVMatrix" ), false, flatten(mvMatrix) );
    gl.uniformMatrix4fv(gl.getUniformLocation( program, "uPMatrix" ), false, flatten(pMatrix) );
}