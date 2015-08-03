function Camera(level, x, y){
  this.level = level;
	this.x = defaultTo(x, 0);
	this.y = defaultTo(y, 0);
	this.z = 0;
	this.eye_z = 100;
	this.zoom = 1;

	this.width = gl.viewportWidth / this.zoom;
	this.height = gl.viewportHeight / this.zoom;
	
	this.leader = null;
	
	this.view = "";
}
Camera.prototype.Follow = function(object){
	this.leader = object;
}

Camera.prototype.render = function(zoom, room){
	this.zoom = zoom;
	var x_offset = 256.0 / zoom;
	var y_offset = 176.0 / zoom;
	
	var x = this.x;
	var y = this.y;
	var width = gl.viewportWidth / zoom;
	var height = gl.viewportHeight / zoom;
	this.width = width;
	this.height = height;
	
	if (this.leader !== null && this.leader !== undefined){
		var object = this.leader;
		//move the camera with the x/y offset buffers
		if (object.x + object.width + x_offset > x + width)
			x += object.x + object.width + x_offset - (x + width);
		if (object.x < x + x_offset)
			x += object.x - (x + x_offset);

		if (object.y + object.height + y_offset > y + height)
			y += object.y + object.height + y_offset - (y + height);
		if (object.y < y + y_offset)
			y += object.y - (y + y_offset);

		//correct the x and y positions so the buffer doesn't look past
		//the boundaries of the room
		if (x < 0) x = 0;
		if (x + width > room.width)
			x = room.width - width;
		if (y < 0) y = 0;
		if (y + height > room.height)
			y = room.height - height;

		//move the camera past room boundaries sticking to the tracked object
		//(allows for hidden paths)
		if (object.x + object.width > x + width){
			//x += object.x + object.width - (x + width);
			                    //y, x, z
			this.level.ChangeRoom(0, 1, 0, true);
		}else if (object.x < x){
			//x += object.x - (x);
			this.level.ChangeRoom(0, -1, 0, true);
		}

		if (object.y + object.height > y + height){
			//y += object.y + object.height - (y + height);
			this.level.ChangeRoom(1, 0, 0, true);
		}else if (object.y < y){
			//y += object.y - (y);
			this.level.ChangeRoom(-1, 0, 0, true);
		}

		this.x = x;
		this.y = y;
		this.eye_z = object.z + 100;

		y *= -1;
	}
	
	this.CalculateMatrices(x, y, width, height, zoom);
}

Camera.prototype.IsOrthogonal = function(){
	return (this.view === "orthogonal");
}

Camera.prototype.CalculateMatrices_orthogonal = function(x, y, width, height, zoom){
	this.view = "orthogonal";

	//left, right, bottom, top, near, far, dest
	mat4.ortho(x, x+width, y-height, y, this.z-100, this.z+200, pMatrix);
}
Camera.prototype.CalculateMatrices_perspective = function(x, y, width, height, zoom){
	this.view = "perspective";
	
	mat4.translate(mvMatrix, [(-320/this.zoom)-x, (240/this.zoom)-y, -this.eye_z]);
	
	mat4.identity(pMatrix);
	//fovy, aspect, near, far, dest
	mat4.perspective(200 / this.zoom, gl.viewportWidth / gl.viewportHeight, 0.1, 500, pMatrix);
}

Camera.prototype.CalculateMatrices = Camera.prototype.CalculateMatrices_orthogonal;

Camera.prototype.ToggleProjectionView = function(){
	if (this.IsOrthogonal())
		this.CalculateMatrices = this.CalculateMatrices_perspective;
	else
		this.CalculateMatrices = this.CalculateMatrices_orthogonal;
}