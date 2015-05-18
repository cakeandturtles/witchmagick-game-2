function LevelArchitect(canvas, input, level){
	GLObject.call(this, "tile.png", 0, 0, 0, 0, 0, Game.TILE_SIZE, Game.TILE_SIZE, Game.TILE_SIZE, Game.TILE_SIZE);
	this.type = "LevelArchitect";
	this.alpha = 0.5;
	
	this.InitMenu();
	this.input = input;
	this.level = level;
	this.room = level.room;
	this.camera = level.camera;
	this.is_mouse_down = false;
	this.deleting = false;
	this.tile_placement_depth = 1;
	
	canvas.onmousedown = this.mouseDown.bind(this);
	canvas.onmouseup = this.mouseUp.bind(this);
	canvas.onmousemove = this.mouseMove.bind(this);
	canvas.onmousewheel = this.mouseScroll.bind(this);
	canvas.onmouseout = this.mouseOut.bind(this);
	
	this.mouseOut();
}
extend(GLObject, LevelArchitect);

LevelArchitect.prototype.InitMenu = function(){
	this.menu = {};
	this.menu.dom = document.getElementById("level-architect-menu");
	
	//CAMERA OPTION
	this.menu.camera_option = document.getElementById("level-architect-camera");
	this.menu.camera_option.onclick = function(e){
		var perspective_toggle = "<input type='checkbox' onchange='" +
			"var camera = game.level.camera;" + 
			"if (this.checked){" +
			"	camera.CalculateMatrices = camera.CalculateMatrices_perspective;" + 
			"}else{" +
			"	camera.CalculateMatrices = camera.CalculateMatrices_orthogonal;" +
			"}'/> Turn on Perspective";
		var content = perspective_toggle;
		Dialog.Alert(content, "game camera");
	}
	
	//TILE OPTION
	this.menu.tile_option = document.getElementById("level-architect-tile");
	this.menu.tile_option.onclick = function(e){
		var tile_placement_depth = "tile placement depth: <input type='number' value='1' oninput='" + 
		"var number = Number(this.value);" + 
		"if (number < 1) number = 1;" + 
		"game.level.architect.tile_placement_depth = number;" + 
		"this.value = number;" + 
		"'/>";
		var content = tile_placement_depth;
		Dialog.Alert(content, "tile placement");
	}
	
	var doms = Object.keys(this.menu);
	for (var i = 0; i < doms.length; i++){
		this.menu[doms[i]].onmouseover = function(e){
			this.style.opacity = "1.0";
		}
		this.menu[doms[i]].onmouseout = function(e){
			this.style.opacity = "0.3";
		}
	}
}

LevelArchitect.prototype.PlaceTiles = function(){
	var y_index = this.y / Game.TILE_SIZE;
	var x_index = this.x / Game.TILE_SIZE;
	for (var i = 0; i < this.height / Game.TILE_SIZE; i++){
		for (var j = 0; j < this.width / Game.TILE_SIZE; j++){
			for (var k = this.camera.z; k > this.camera.z - this.tile_placement_depth*Game.TILE_SIZE; k-=Game.TILE_SIZE){
				if (!this.deleting){
					this.room.AddTile(y_index + i, x_index + j, k/Game.TILE_SIZE, new Tile("tile.png", this.x + j*Game.TILE_SIZE, this.y + i*Game.TILE_SIZE, k, Game.TILE_SIZE, Game.TILE_SIZE, Game.TILE_SIZE, Collision.SOLID), true);
				}else{
					this.room.RemoveTile(y_index + i, x_index + j, k/Game.TILE_SIZE, true);
				}
			}
		}
	}
}

LevelArchitect.prototype.mouseDown = function(e){
	this.is_mouse_down = true;
	this.deleting = false;
	if (e.which === 3)
		this.deleting = true;
	this.PlaceTiles();
}
LevelArchitect.prototype.mouseUp = function(e){
	this.is_mouse_down = false;
	this.room.AggregateTiles();
}
LevelArchitect.prototype.mouseMove = function(e){
	var mouseX = e.clientX + document.body.scrollLeft;
	var mouseY = e.clientY + document.body.scrollTop;
	var gridX = ~~((mouseX + this.camera.x*this.room.zoom) / (Game.TILE_SIZE * this.room.zoom));
	var gridY = ~~((mouseY + this.camera.y*this.room.zoom) / (Game.TILE_SIZE * this.room.zoom));
	
	this.x = gridX * Game.TILE_SIZE;
	this.y = gridY * Game.TILE_SIZE;
	
	if (this.is_mouse_down) this.PlaceTiles();
}
LevelArchitect.prototype.mouseScroll = function(e){
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	
	if (this.input.IsKeyDown("z")){ //z for zoom
		if (delta > 0){ //scroll up
			this.room.zoom--;
			if (this.room.zoom < 1) this.room.zoom = 1;
		}
		else if (delta < 0){ //scroll down
			this.room.zoom++;
			if (this.room.zoom > 12) this.room.zoom = 12;
		}
	}
	else{
		//scroll up
		if (delta > 0){
			this.width -= Game.TILE_SIZE;
			if (this.width < Game.TILE_SIZE)
				this.width = Game.TILE_SIZE;
		}
		//scroll down
		else if (delta < 0){
			this.width += Game.TILE_SIZE
			if (this.width > Game.TILE_SIZE * 4)
				this.width = Game.TILE_SIZE * 4;
		}
		this.height = this.width;
	}
}
LevelArchitect.prototype.mouseOut = function(e){
	this.x = this.room.width;
	this.y = this.room.height;
}

LevelArchitect.prototype.render = function(){	
	//adjust vertex positions
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_position_buffer);
	var vertices = [
		// Front face
		0.0, 0.0,  0.0,
		this.width, 0.0,  0.0,
		0.0,  this.height,  0.0,
		this.width,  this.height,  0.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	
	//adjust texture coords
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coord_buffer);
	var textureCoords = [
	  // Front face
	  0.0, 0.0,
	  1.0 / (Game.TILE_SIZE / this.width), 0.0,
	  0.0, 1.0 / (Game.TILE_SIZE / this.height),
	  1.0 / (Game.TILE_SIZE / this.width), 1.0 / (Game.TILE_SIZE / this.height),
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	
	GLObject.prototype.render.call(this);
}