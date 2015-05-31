function NpcOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-npc", "option_npc.png", "npc_sheet.png");
	
	this.npc_grav_acc = 0;
	this.npc = null;
	this.visible = true;
}
extend(Option, NpcOption);

NpcOption.prototype.DeleteNpc = function(x, y){
	
}

NpcOption.prototype.mouseDown = function(x, y, is_right_mb, level){
	if (!is_right_mb){
		this.npc = new Npc(this.x, this.y);
		this.npc_grav_acc = this.npc.grav_acc;
		this.npc.grav_acc = 0;
		this.visible = false;
		
		level.room.entities.push(this.npc);
	}else{
		this.DeleteNpc(x, y);
	}
}

NpcOption.prototype.mouseUp = function(x, y, is_right_mb, level){
	if (!is_right_mb){
		if (this.npc !== null)
			this.npc.grav_acc = this.npc_grav_acc;
		this.npc = null;
		this.visible = true;
	}
}

NpcOption.prototype.mouseMove = function(x, y, is_right_mb, level, is_mouse_down){
	this.x = x;
	this.y = y;
	
	if (is_mouse_down && !is_right_mb){
		if (this.npc !== null){
			this.npc.x = this.x;
			this.npc.y = this.y;
		}
	}else if (is_mouse_down){
		this.DeleteNpc(x, y);
	}
}

NpcOption.prototype.render = function(camera){
	if (!this.visible) return;
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