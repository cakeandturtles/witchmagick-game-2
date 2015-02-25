function Camera(x, y, zoom){
	this.x = x;
	this.y = y;
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
	if (this.tracking_target !== null){
		this.x = this.tracking_target.x;
		this.y = this.tracking_target.y;
	}
}