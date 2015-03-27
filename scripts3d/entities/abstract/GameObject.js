function GameObject(x, y, z, bounding_box){
	this.type = "GameObject";
	this.x = x;
	this.y = y;
	this.z = z;
	this.original_coords = [x, y, z];
	
	//facing is on an angle (degreees), with 0.0 being positive x, moving counterclockwise
	this.facing = 90.0; 
	this.original_facing = this.facing;
	
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
		bounding_box: this._getBoundingBox(),
		kill_player: this.kill_player
	};
}

GameObject.prototype._getBoundingBox = function(){
	return [this.x1, this.x2, this.y1, this.y2, this.z1, this.z2];
}

GameObject.prototype.GetRotatedBoundingBox = function(use_position){
	var v = this.BoundingBoxToVertices(use_position);
	return {
		coordinates: [
			//coordinates for the bottom face
			[v[0][0], v[0][2]], 
			[v[1][0], v[1][2]], 
			[v[2][0], v[2][2]], 
			[v[4][0], v[4][2]],
			//coordinates for the top face
			[v[6][0], v[6][1], v[6][2]], 
			[v[7][0], v[7][1], v[7][2]], 
			[v[8][0], v[8][1], v[8][2]], 
			[v[10][0], v[10][1], v[10][2]]
		],
		y_bot: v[0][1],
		y_top: v[6][1]
	};
}

GameObject.prototype.BoundingBoxToVertices = function(use_position){
	var vertices = [];
	if (use_position === undefined) use_position = true;
	
	var x = this.x, y = this.y, z = this.z;
	if (!use_position){
		x = 0; y = 0; z = 0;
	}
	
	var x1 = this.x1, x2 = this.x2;
	var xlen = (x2 - x1) / 2;
	var y1 = this.y1, y2 = this.y2;
	var ylen = (y2 - y1) / 2;
	var z1 = this.z1, z2 = this.z2;
	var zlen = (z2 - z1) / 2;
	
	vertices = [
		//bottom face
		vec4.fromValues(x+x1, y+y1, z+z1, 1.0), vec4.fromValues(x+x2, y+y1, z+z1, 1.0), vec4.fromValues(x+x2, y+y1, z+z2, 1.0),	
		vec4.fromValues(x+x1, y+y1, z+z1, 1.0), vec4.fromValues(x+x1, y+y1, z+z2, 1.0), vec4.fromValues(x+x2, y+y1, z+z2, 1.0),
		//top face
		vec4.fromValues(x+x1, y+y2, z+z1, 1.0), vec4.fromValues(x+x2, y+y2, z+z1, 1.0), vec4.fromValues(x+x2, y+y2, z+z2, 1.0),	
		vec4.fromValues(x+x1, y+y2, z+z1, 1.0), vec4.fromValues(x+x1, y+y2, z+z2, 1.0), vec4.fromValues(x+x2, y+y2, z+z2, 1.0),
		//back face
		vec4.fromValues(x+x1, y+y1, z+z1, 1.0), vec4.fromValues(x+x1, y+y2, z+z1, 1.0), vec4.fromValues(x+x2, y+y2, z+z1, 1.0),
		vec4.fromValues(x+x1, y+y1, z+z1, 1.0), vec4.fromValues(x+x2, y+y2, z+z1, 1.0), vec4.fromValues(x+x2, y+y1, z+z1, 1.0),
		//front face
		vec4.fromValues(x+x1, y+y1, z+z2, 1.0), vec4.fromValues(x+x1, y+y2, z+z2, 1.0), vec4.fromValues(x+x2, y+y2, z+z2, 1.0),
		vec4.fromValues(x+x1, y+y1, z+z2, 1.0), vec4.fromValues(x+x2, y+y2, z+z2, 1.0), vec4.fromValues(x+x2, y+y1, z+z2, 1.0),
		//left face
		vec4.fromValues(x+x1, y+y1, z+z1, 1.0), vec4.fromValues(x+x1, y+y2, z+z1, 1.0), vec4.fromValues(x+x1, y+y1, z+z2, 1.0),
		vec4.fromValues(x+x1, y+y1, z+z2, 1.0), vec4.fromValues(x+x1, y+y2, z+z2, 1.0), vec4.fromValues(x+x1, y+y2, z+z1, 1.0),
		//right face
		vec4.fromValues(x+x2, y+y1, z+z1, 1.0), vec4.fromValues(x+x2, y+y2, z+z1, 1.0), vec4.fromValues(x+x2, y+y1, z+z2, 1.0),
		vec4.fromValues(x+x2, y+y1, z+z2, 1.0), vec4.fromValues(x+x2, y+y2, z+z2, 1.0), vec4.fromValues(x+x2, y+y2, z+z1, 1.0)
	];
	
	//translate to the origin so rotation will happen correctly!
	var T1 = mat4.translate([], mat4.create(), [-(x + xlen), -(y + ylen), -(z + zlen)]);
	//rotate bounding box by the facing
	var R = mat4.rotateY([], mat4.identity([]), degToRad(this.facing));
	//translate back
	var T2 = mat4.translate([], mat4.create(), [x + xlen, y + ylen, z + zlen]);
	
	for (var i = 0; i < vertices.length; i++){	
		vertices[i] = matrixTimesVector(T1, vertices[i]);
		vertices[i] = matrixTimesVector(R, vertices[i]);
		vertices[i] = matrixTimesVector(T2, vertices[i]);
	}
	
	return vertices;
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

GameObject.prototype.IsPlaneColliding = function(plane, coordinates, y1, y2){
	var center = getCenterOfSquare(coordinates);
	var x = center[0];
	var z = center[1];
	//here i'm gonna cheat and just treat the center of the bottom of the object the only thing i need to check
	//assuming non rotating bodies 
	//(plane may be at any rotation)
	var plane_y = plane.GetYPosition(x, z);
	if (plane_y <= y1 && plane_y >= y2){
		var vertices = flatten(plane.vertices);
		for (var i = 0; i < 3; i++){
			vertices[i*4+1] = plane_y;
		}
		return pointInTriangle([x, z], 
			[vertices[0], vertices[2]],
			[vertices[4], vertices[6]],
			[vertices[8], vertices[10]]
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