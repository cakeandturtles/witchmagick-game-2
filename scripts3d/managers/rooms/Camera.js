function Camera(eye, at){
	this.eye = eye;
	this.zoom_z = 3.0;
	this.zoom_y = 1.0;
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

		var x = target.x; var y = target.y; var z = target.z;
		var x1 = target.x1, x2 = target.x2;
		var xlen = (x2 - x1) / 2;
		var y1 = target.y1, y2 = target.y2;
		var ylen = (y2 - y1) / 2;
		var z1 = target.z1, z2 = target.z2;
		var zlen = (z2 - z1) / 2;
		
		//start eye at center of player
		var eye = vec4.fromValues(x + xlen, y + ylen, z+zlen, 1.0); 
		var at = vec4.fromValues(x + xlen, y + ylen, z+zlen, 1.0);
		
		//translate to the origin so rotation will happen correctly!
		var T0 = mat4.translate([], mat4.create(), [-(x + xlen), -(y + ylen), -(z + zlen)]);
		eye = matrixTimesVector(T0, eye);
		at = matrixTimesVector(T0, at);
		
		//translate behind the player before rotating
		var T1e = mat4.translate([], mat4.create(), [0, this.zoom_y, this.zoom_z]);
		eye = matrixTimesVector(T1e, eye);
		
		//or in front of player for at
		var T1a = mat4.translate([], mat4.create(), [0, 0.4, -1.0]);
		at = matrixTimesVector(T1a, at);
		
		//rotate bounding box by the facing
		var R = mat4.rotateY([], mat4.identity([]), degToRad(target.facing-90));
		eye = matrixTimesVector(R, eye);
		at = matrixTimesVector(R, at);
		
		//translate back
		var T2 = mat4.translate([], mat4.create(), [x + xlen, y + ylen, z + zlen]);
		eye = matrixTimesVector(T2, eye);
		at = matrixTimesVector(T2, at);
		
		this.eye = eye;
		this.at = at;
	}
}

Camera.prototype.Render = function(){	
	var near = 0.1;
	var far = 100.0;
	
	var fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
	var aspect = Game.CANVAS_WIDTH / Game.CANVAS_HEIGHT;       // Viewport aspect ratio
	
	var up = vec3.fromValues(0.0, 1.0, 0.0);
    var mvMatrix = mat4.lookAt([], this.eye, this.at, up);
    var pMatrix = mat4.perspective([], fovy, aspect, near, far);

    gl.uniformMatrix4fv(gl.getUniformLocation( program, "uMVMatrix" ), false, new Float32Array(flatten(mvMatrix)));
    gl.uniformMatrix4fv(gl.getUniformLocation( program, "uPMatrix" ), false, new Float32Array(flatten(pMatrix)));
}