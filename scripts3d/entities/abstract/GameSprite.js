function GameSprite(x, y, z, bounding_box, img_name){
	GameObject.call(this, x, y, z, bounding_box);
	this.type = "GameSprite";
	this.img_name = img_name;
	if (this.img_name != undefined){
		this.image = getImage(this.img_name);
	}
	else this.image = null;
	/*this.animation = new Animation(1, 8);
	this.base_ani_x = 0;
	this.base_ani_y = 0;*/
	
	this.vertices = this.BoundingBoxToVertices();
	//initialize color buffer in webgl
	var color_array = [];
	for (var i = 0; i < this.vertices.length; i++){
		color_array.push(vec4(0.8, 0.1, 0.1, 1.0));
	}
	
	//color buffer
    this.color_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.color_buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(color_array), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);
	//initialize the vertex buffer in webgl
	this.vertex_buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.vertex_buffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW );
	
	this.visible = true;
}
extend(GameObject, GameSprite);

GameSprite.prototype.Import = function(obj){
	GameObject.prototype.Import.call(this, obj);
	this.img_name = obj.img_name;
	this.image = getImage(this.img_name);
}
GameSprite.prototype.Export = function(){
	var obj = GameObject.prototype.Export.call(this);
	obj.img_name = this.img_name;
	return obj;
}

/** FUNCTION DEFINITIONS****************************************/
/**????????????????????????????????????????????????????????????*/

GameSprite.prototype.Update = function(delta, plane_manager, entity_manager){
	//this.animation.Update(delta);
	GameObject.prototype.Update.call(this, delta, plane_manager, entity_manager);
}

GameSprite.prototype.Render = function(ctx, camera){
	this.vertices = this.BoundingBoxToVertices();
	
	//bind plane's vertex buffer to tell gpu to use it
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW );
	vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	//bind plane's color buffer to tell gpu to use it
	gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
	vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	
	//draw the plane
    gl.drawArrays( gl.TRIANGLES, 0, this.vertices.length);
	/*if (this.image === null || !this.visible) return;
	var ani = this.animation;
	var row = ani.rel_ani_y;
	var column = ani.rel_ani_x + ani.curr_frame;
	
	ctx.drawImage(this.image, 
		//SOURCE RECTANGLE
		ani.frame_width * column + ani.abs_ani_x + this.base_ani_x,
		ani.frame_height * row + ani.abs_ani_y + this.base_ani_y,
		ani.frame_width, ani.frame_height,
		//DESTINATION RECTANGLE
		~~((~~(this.x-camera.x+0.5) + ani.x_offset)*camera.zoom), 
		~~((~~(this.y-camera.y+0.5)+ ani.y_offset)*camera.zoom),
		ani.frame_width*camera.zoom, ani.frame_height*camera.zoom
	);*/
}