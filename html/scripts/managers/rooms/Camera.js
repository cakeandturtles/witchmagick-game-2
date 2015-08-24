function Camera(x, y, zoom){
	this.x = x;
	this.y = y;
	this.x_buffer = 50;
	this.y_buffer = 50;
	this.zoom = zoom;
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