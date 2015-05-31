function PlayerOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-player", "option_player.png", "sprite_sheet.png");
}
extend(Option, PlayerOption);

PlayerOption.prototype.PlacePlayer = function(level){
	level.player.x = this.x;
	level.player.y = this.y;
	level.player.vel.y = 0;
	level.player.vel.x = 0;
	level.player.vel.z = 0;
	level.player.move_state = MoveState.STANDING;
}

PlayerOption.prototype.mouseDown = function(x, y, is_right_mb, level){
	if (!is_right_mb){
		this.PlacePlayer(level);
	}
}

PlayerOption.prototype.mouseUp = function(x, y, is_right_mb, level){
	if (!is_right_mb){
		this.PlacePlayer(level);
	}
}

PlayerOption.prototype.mouseMove = function(x, y, is_right_mb, level, is_mouse_down){
	this.x = x;
	this.y = y;
	
	if (is_mouse_down && !is_right_mb){
		this.PlacePlayer(level);
	}
}

PlayerOption.prototype.render = function(camera){
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coord_buffer);
	var textureCoords = [
	  // Front face
	  0.0, 0.75,
	  0.25, 0.75,
	  0.0, 1,
	  0.25, 1,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
		
	GLObject.prototype.render.call(this, camera);
}