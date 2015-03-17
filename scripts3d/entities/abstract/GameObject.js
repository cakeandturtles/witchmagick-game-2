function GameObject(x, y, z, bounding_box){
	this.type = "GameObject";
	this.x = x;
	this.y = y;
	this.z = z;
	this.original_coords = [x, y, z];
	
	/*SET UP BouNDING BOX*/ //BOUNDING BOX COORDINATES RELATIVE FROM object's x, y, z
	this.x1 = bounding_box[0];
	this.x2 = bounding_box[1];
	this.width = this.x2 - this.x1;
	
	this.y1 = bounding_box[2];
	this.y2 = bounding_box[3];
	this.height = this.y2 - this.y1;
	
	this.z1 = bounding_box[4];
	this.z2 = bounding_box[5];
	this.depth = this.z2 - this.z1;
	/*END BINDING BOX*/

	this.bounding_box = bounding_box;
	
	this.delete_me = false;
	
	this.kill_player = false;
}

GameObject.prototype.Import = function(obj){
	this.x = obj.x;
	this.y = obj.y;
	this.z = obj.z;
	this.original_coords = obj.original_coords.slice();
	this.SetBoundingBox(obj.bounding_box);
	this.kill_player = obj.kill_player || false;
}
GameObject.prototype.Export = function(){
	return {
		x: this.x,
		y: this.y,
		z: this.z,
		bounding_box: this.GetBoundingBox(),
		kill_player: this.kill_player
	};
}

GameObject.prototype.GetBoundingBox = function(){
	return [this.x1, this.x2, this.y1, this.y2, this.z1, this.z2];
}
GameObject.SetBoundingBox = function(bounding_box){
	this.x1 = bounding_box[0];
	this.x2 = bounding_box[1];
	this.width = this.x2 - this.x1;
	
	this.y1 = bounding_box[2];
	this.y2 = bounding_box[3];
	this.height = this.y2 - this.y1;
	
	this.z1 = bounding_box[4];
	this.z2 = bounding_box[5];
	this.depth = this.z2 - this.z1;
}

GameObject.prototype.ResetPosition = function(){
	this.x = this.original_coords[0];
	this.y = this.original_coords[1];
	this.z = this.original_coords[2];
}
GameObject.prototype.Update = function(delta, plane_manager, entity_manager){}
GameObject.prototype.Render = function(){}

/**************************COLLISION DETECTION*************************************/
//object is of type GameObject
GameObject.prototype.IsColliding = function(object){
	return this.IsRectColliding(object, 
		this.x+this.x1, this.x+this.x2, 
		this.y+this.y1, this.y+this.y2, 
		this.z+this.z1, this.z+this.z2
	);
}

GameObject.prototype.IsPlaneColliding = function(plane, x1,x2, y1,y2, z1,z2){
	var x = (x1+x2)/2;
	var z = (z1+z2)/2;
	//here i'm gonna cheat and just treat the center of the bottom of the object the only thing i need to check
	//assuming non rotating bodies (plane may be at any rotation)
	var plane_y = plane.GetYPosition(x, z);
	if (plane_y <= y1 && plane_y >= y2){
		var vertices = plane.vertices;
		for (var i = 0; i < 3; i++){
			vertices[i][1] = plane_y;
		}
		return pointInTriangle([x, z], 
			[vertices[0][0], vertices[0][2]],
			[vertices[1][0], vertices[1][2]],
			[vertices[2][0], vertices[2][2]]
		);
	}
	return false;
}

GameObject.prototype.IsRectColliding = function(obj, x1,x2, y1,y2, z1,z2){
	if (x1 <= obj.x + obj.x2 && x2 >= obj.x + obj.x1 &&
		y1 <= obj.y + obj.y2 && y2 >= obj.y + obj.y1 &&
		z1 <= obj.z + obj.z2 && z2 >= obj.z + obj.z1)
			return true;
	return false;
}

GameObject.prototype.IsPointColliding = function(x, y, z){
	if (x <= this.x + this.x2 && x >= this.x + this.x1 &&
		y <= this.y + this.y2 && y >= this.y + this.y1 &&
		z <= this.z + this.z2 && z >= this.z + this.z1)
			return true;
	return false;
}

GameObject.prototype.ReturnCollidingObjects = function(objects){
	var colliding_objects = [];
	for (var i = 0; i < objects.length; i++){
		if (this.IsColliding(objects[i])){
			colliding_objects.push(objects[i]);
		}
	}
	return colliding_objects;
}