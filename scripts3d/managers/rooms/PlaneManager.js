function Plane(vertices, collision, texture){
	this.vertices = vertices;
	
	//one of the collision types defined below
	this.collision = collision || Plane.GHOST;
	
	this.texture = texture;
	
	var color = vec4.fromValues(0.0, 0.0, 0.0, 0.0);
	switch (this.collision){
		case Plane.GHOST: return;
		case Plane.FALLTHROUGH:
			color = vec4.fromValues(0.0, 1.0, 1.0, 0.5);
			break;
		case Plane.SOLID:
			color = vec4.fromValues(0.5, 0.5, 0.5, 1.0);
			break;
		case Plane.SUPER_SOLID:
			color = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
			break;
		case Plane.KILL_PLAYER:
			color = vec4.fromValues(1.0, 0.0, 0.0, 0.5);
			break;
		default: return;
	}
	this.color_array = [];
	for (var i = 0; i < this.vertices.length; i++){
		this.color_array.push(color);
	}
	
	//color buffer
    this.color_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.color_buffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(flatten(this.color_array)), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);
	//vertex buffer
    this.vertex_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.vertex_buffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(flatten(this.vertices)), gl.STATIC_DRAW );
	var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

//Collision types
Plane.GHOST = 0;
Plane.FALLTHROUGH = 1;
Plane.SOLID = 2;
Plane.SUPER_SOLID = 3;
Plane.KILL_PLAYER = 4;

Plane.prototype.Render = function(){
	//bind plane's vertex buffer to tell gpu to use it
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(flatten(this.vertices)), gl.STATIC_DRAW );
	vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	//bind plane's color buffer to tell gpu to use it
	gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(flatten(this.color_array)), gl.STATIC_DRAW );
	vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	
	//draw the plane
    gl.drawArrays( gl.TRIANGLES, 0, this.vertices.length);
}

//assuming a plane only has three vertices
Plane.prototype.GetXPosition = function(y, z){
	var abc = planeEquation(this.vertices[0], this.vertices[1], this.vertices[2]);
	return -((abcm[1]*y + abcm[2]*z - abcm[3])/abcm[0]);
}
Plane.prototype.GetYPosition = function(x, z){
	var abcm = planeEquation(this.vertices[0], this.vertices[1], this.vertices[2]);
	return -((abcm[0]*x + abcm[2]*z - abcm[3])/abcm[1]);
}
Plane.prototype.GetZPosition = function(x, y){
	var abcm = planeEquation(this.vertices[0], this.vertices[1], this.vertices[2]);
	return -((abcm[0]*x + abcm[1]*y - abcm[3])/abcm[2]);
}

//////////////////////////////////////////////////////////PLANE MANAGER
function PlaneManager(room_width, room_height, room_depth, default_layout){
	this.room_width = room_width;
	this.room_height = room_height;
	this.room_depth = room_depth;
	
	this.planes = {};
	if (default_layout){
		this.initDefaultPlaneLayout(room_width, room_height, room_depth);
	}
}

//x_coord and y_coord are integers (0, 1, 2, 3) representing the position of
//the requested tile in the room, (e.g. if x, y = (1, 1), then we will below
//looking for the tile at pixel position Game.TILE_SIZE, Game.TILE_SIZE
PlaneManager.prototype.GetTile = function(x_coord, y_coord){
	if (x_coord < 0 || x_coord >= this.width || y_coord < 0 || y_coord >= this.height)
		return null;
	var key = x_coord + "_" + y_coord;
	if (key in this.tiles){
		return this.tiles[key];
	}
	return null;
}

PlaneManager.prototype.AddTile = function(x_coord, y_coord, collision, x_graph, y_graph){
	var key = x_coord + "_" + y_coord;
	this.tiles[key] = new Tile(x_coord, y_coord, collision, x_graph, y_graph);
}

PlaneManager.prototype.RemoveTile = function(x_coord, y_coord){
	var key = x_coord + "_" + y_coord;
	if (key in this.tiles){
		delete this.tiles[key];
	}
}

PlaneManager.prototype.initDefaultPlaneLayout = function(room_width, room_height, room_depth){	
	/*for (var i = 0; i < this.width; i++){
		for (var j = 0; j < this.height; j++){
			//Add tiles around the edge of the room
			if (i === 0 || i === this.width-1 || j === 0 || j === this.height-1){
				this.AddTile(i, j, Tile.SOLID, 0, 0);
			}
		}
	}*/
	var planes = [];
	planes.push(new Plane([
		vec4.fromValues(-1.0, 0.0, -1.0, 1.0),
		vec4.fromValues(1.0, 0.0, -1.0, 1.0),
		vec4.fromValues(0.0, 0.0, 1.0, 1.0)
	], Plane.SOLID, null));
	this.planes = {};
	this.planes[0] = planes[0];
}