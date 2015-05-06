function Plane(vertices, collision, texture){
	this.vertices = vertices;
	this.PQ = vectorFromPoints(this.vertices[0], this.vertices[1]);
	this.PR = vectorFromPoints(this.vertices[0], this.vertices[2]);
	this.abcd = planeEquation(this.PQ, this.PR);
	this.normal_vertices = [
		vec3.fromValues(this.abcd[0], this.abcd[1], this.abcd[2]),
		vec3.fromValues(this.abcd[0], this.abcd[1], this.abcd[2]),
		vec3.fromValues(this.abcd[0], this.abcd[1], this.abcd[2]),
	];
	
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
	//vertex buffer
    this.vertex_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.vertex_buffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(flatten(this.vertices)), gl.STATIC_DRAW );
	//normal buffer
	this.normal_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(this.normal_vertices)), gl.STATIC_DRAW);
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
    gl.vertexAttribPointer(gl.getAttribLocation(program, "aVertexPosition"), 4, gl.FLOAT, false, 0, 0 );
	//bind plane's normal!!!
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(this.normal_vertices)), gl.STATIC_DRAW);
	gl.vertexAttribPointer(gl.getAttribLocation(program, "aVertexNormal"), 3, gl.FLOAT, false, 0, 0);
	//bind plane's color buffer to tell gpu to use it
	gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(flatten(this.color_array)), gl.STATIC_DRAW );
	gl.vertexAttribPointer(gl.getAttribLocation(program, "aVertexColor"), 4, gl.FLOAT, false, 0, 0);
	
	//draw the plane
    gl.drawArrays( gl.TRIANGLES, 0, this.vertices.length);
}

//assuming a plane only has three vertices
Plane.prototype.GetXPosition = function(y, z){
	var abcd = this.abcd;
	var a = abcd[0], b = abcd[1], c = abcd[2], d = abcd[3];
	return (d - (b*y) - (c*z))/a;
}
Plane.prototype.GetYPosition = function(x, z){
	var abcd = this.abcd;
	var a = abcd[0], b = abcd[1], c = abcd[2], d = abcd[3];
	return (d - (a*x) - (c*z))/b;
}
Plane.prototype.GetZPosition = function(x, y){
	var abcd = this.abcd;
	var a = abcd[0], b = abcd[1], c = abcd[2], d = abcd[3];
	return (d - (a*x) - (b*y))/c;
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

PlaneManager.prototype.GetPlanesAsArray = function(){
	return this.planes;
}

PlaneManager.prototype.initDefaultPlaneLayout = function(room_width, room_height, room_depth){	
	var planes = [];
	//flat ground
	planes.push(new Plane([
		vec4.fromValues(-1.0, 0.0, -1.0, 1.0),
		vec4.fromValues(1.0, 0.0, -1.0, 1.0),
		vec4.fromValues(0.0, 0.0, 0.5, 1.0)
	], Plane.FALLTHROUGH, null));
	//slope 1
	planes.push(new Plane([
		vec4.fromValues(-1.0, 0.0, -1.0, 1.0),
		vec4.fromValues(-1.0, 0.5, -2.0, 1.0),
		vec4.fromValues(1.0, 0.0, -1.0, 1.0),
	], Plane.SOLID, null));
	planes.push(new Plane([
		vec4.fromValues(1.0, 0.5, -2.0, 1.0),
		vec4.fromValues(1.0, 0.0, -1.0, 1.0),
		vec4.fromValues(-1.0, 0.5, -2.0, 1.0)
	], Plane.SOLID, null));	
	//wall
	planes.push(new Plane([
		vec4.fromValues(-1.0, 0.5, -2.0, 1.0),
		vec4.fromValues(1.0, 0.5, -2.0, 1.0),
		vec4.fromValues(-1.0, 1.0, -2.0, 1.0)
	], Plane.SOLID, null));
	planes.push(new Plane([
		vec4.fromValues(1.0, 1.0, -2.0, 1.0),
		vec4.fromValues(1.0, 0.5, -2.0, 1.0),
		vec4.fromValues(-1.0, 1.0, -2.0, 1.0)
	], Plane.SOLID, null));
	//slope 2
	planes.push(new Plane([
		vec4.fromValues(1.0, 0.0, -1.0, 1.0),
		vec4.fromValues(2.0, 0.5, -1.0, 1.0),
		vec4.fromValues(1.0, 0.5, -2.0, 1.0)
	], Plane.SOLID, null));
	//slope3
	planes.push(new Plane([
		vec4.fromValues(2.0, 0.5, -1.0, 1.0),
		vec4.fromValues(1.0, 0.0, -1.0, 1.0),
		vec4.fromValues(0.0, 0.0, 0.5, 1.0)
	], Plane.SOLID, null));
	planes.push(new Plane([
		vec4.fromValues(0.0, 0.0, 0.5, 1.0),
		vec4.fromValues(2.0, 0.5, -1.0, 1.0),
		vec4.fromValues(1.0, 0.5, 1.5, 1.0)
	], Plane.SOLID, null));
	//slope 4 (mirror 2)
	planes.push(new Plane([
		vec4.fromValues(-1.0, 0.0, -1.0, 1.0),
		vec4.fromValues(-2.0, 0.5, -1.0, 1.0),
		vec4.fromValues(-1.0, 0.5, -2.0, 1.0)
	], Plane.SOLID, null));
	//slope5 (mirror 3)
	planes.push(new Plane([
		vec4.fromValues(-2.0, 0.5, -1.0, 1.0),
		vec4.fromValues(-1.0, 0.0, -1.0, 1.0),
		vec4.fromValues(0.0, 0.0, 0.5, 1.0)
	], Plane.SOLID, null));
	planes.push(new Plane([
		vec4.fromValues(0.0, 0.0, 0.5, 1.0),
		vec4.fromValues(-2.0, 0.5, -1.0, 1.0),
		vec4.fromValues(-1.0, 0.5, 1.5, 1.0)
	], Plane.SOLID, null));
	//slope 6
	planes.push(new Plane([
		vec4.fromValues(0.0, 0.0, 0.5, 1.0),
		vec4.fromValues(-1.0, 0.5, 1.5, 1.0),
		vec4.fromValues(1.0, 0.5, 1.5, 1.0)
	], Plane.SOLID, null));
	
	
	this.planes = planes;
}