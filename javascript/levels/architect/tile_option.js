function TileOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-tile", "option_tile.png", "tile.png");
	
	this.rb = Game.TILE_SIZE;
	this.bb = Game.TILE_SIZE;
	this.width = Game.TILE_SIZE;
	this.height = Game.TILE_SIZE;
	
	this.entity = null;
	
	this.tile_placement_depth = 1;
	
	this.action = TileOption.NORMAL;
	this.prev_action = this.action;
}
extend(Option, TileOption);

TileOption.NORMAL = 0;
TileOption.DELETE = 1;
TileOption.MOVE = 2;

TileOption.prototype.onContextMenu = function(level){
	var self = this;
	
	level.pause();
	Dialog.Alert("", "tile placement", function(){this.tryResume()}.bind(this.architect));
	
	var tile_placement_depth = document.createElement("div");
	var text = document.createTextNode("tile placement depth: " );
	var input = document.createElement("input");
	input.type = "number";
	input.value = this.tile_placement_depth;
	input.oninput = function(){
		var number = Number(this.value);
		if (number < 1) number = 1;
		self.tile_placement_depth = number;
		this.value = number;
	}
	input.style.width = "50px";
	tile_placement_depth.appendChild(text);
	tile_placement_depth.appendChild(input);
	
	//add the elements to the dialog
	Dialog.AddElement(tile_placement_depth);
}

TileOption.prototype.whenSelected = function(){
	this.action = TileOption.NORMAL;
	document.body.style.cursor = "";
	this.alpha = 0.5;
	
	this.initTexture("tile.png");
}

TileOption.prototype.detectKeyInput = function(input, level){
	if (input.IsKeyPressed("shift") && !this.is_mouse_down){
		this.ToggleAction();
	}
}

TileOption.prototype.PlaceTiles = function(deleting, level){
	var x = this.x / Game.TILE_SIZE;
	var y = this.y / Game.TILE_SIZE;
	
	var deleted = false;
	
	for (var i = 0; i < this.height / Game.TILE_SIZE; i++){
		for (var j = 0; j < this.width / Game.TILE_SIZE; j++){
			for (var k = level.camera.z; k > level.camera.z - this.tile_placement_depth*Game.TILE_SIZE; k-=Game.TILE_SIZE){
				if (!deleting){
					level.room.AddTile(y + i, x + j, k/Game.TILE_SIZE, new Tile(this.x + j*Game.TILE_SIZE, this.y + i*Game.TILE_SIZE, k, Game.TILE_SIZE, Game.TILE_SIZE, Game.TILE_SIZE, Collision.SOLID), true);
				}else{
					deleted = level.room.RemoveTile(y + i, x + j, k/Game.TILE_SIZE, true);
				}
			}
		}
	}
	
	if (deleting && deleted !== false){
		level.room.DeaggregateTiles();
		level.room.AggregateTiles();
	}
}

TileOption.prototype.mouseDown = function(x, y, is_right_mb, level){
	if (is_right_mb){
		return;
	}
	if (this.action === TileOption.NORMAL || this.action === TileOption.DELETE){
		this.PlaceTiles(this.action === TileOption.DELETE, level);
		if (this.action === TileOption.DELETE)
			this.alpha = 0;
	}else if (this.action === TileOption.MOVE){
		if (this.entity === null) return;
		this.entity_grav_acc = this.entity.grav_acc;
		this.entity.grav_acc = 0;
		this.visible = false;
		this.entity.x = x;
		this.entity.y = y;
		
		document.body.style.cursor = "-webkit-grabbing";
	}
	
	this.is_mouse_down = true;
}

TileOption.prototype.mouseUp = function(x, y, is_right_mb, level){
	if (is_right_mb){
		return;
	}
	level.room.AggregateTiles();
	
	if (this.entity !== null && this.entity_grav_acc !== 0){
		this.entity.grav_acc = this.entity_grav_acc;
		this.whenSelected();
	}
	this.entity = null;
	
	this.mouseMove(x, y, false, level, false);
	
	this.is_mouse_down = false;
}

TileOption.prototype.mouseMove = function(x, y, is_right_mb, level, is_mouse_down, mouseX, mouseY){
	this.x = x;
	this.y = y;
	
	if (is_right_mb){
		return;
	}
	
	if (is_mouse_down){
		if (this.action === TileOption.NORMAL || this.action === TileOption.DELETE){
			this.PlaceTiles(this.action === TileOption.DELETE, level);
		}else if (this.action === TileOption.MOVE){
			if (this.entity !== null){
				this.entity.x = this.x;
				this.entity.y = this.y;
			}
		}
	}
	else{
		var entity = level.room.GetEntity(x+2, y+2, 0);
		var tile = level.room.GetTile(y / Game.TILE_SIZE, x / Game.TILE_SIZE, 0);
		
		if ((entity === null && this.action === TileOption.MOVE) || (this.entity !== null && this.entity !== entity) ||
			(tile === null && this.action === TileOption.DELETE)){
			this.whenSelected();
			this.entity = null;
		}
		
		if (entity !== null && this.action !== TileOption.MOVE){
			document.body.style.cursor = "-webkit-grab";
			this.alpha = 0.0;
			this.entity = entity;
			
			this.action = TileOption.MOVE;
		}else if (tile !== null && this.action !== TileOption.DELETE){
			this.alpha = 0.8;
			
			this.action = TileOption.DELETE;
			this.initTexture("delete.png");
		}
	}
}

TileOption.prototype.mouseScroll = function(x, y, is_right_mb, level, delta){
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

TileOption.prototype.render = function(){
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