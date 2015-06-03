function NpcOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-npc", "option_npc.png", "npc_sheet.png");
	
	this.is_mouse_down = false;
	this.npc_grav_acc = 0;
	this.npc = null;
	this.context_menu = {};
	this.visible = true;
	
	this.action = NpcOption.NORMAL;
}
extend(Option, NpcOption);

NpcOption.NORMAL = 0;
NpcOption.MOVE = 1;

NpcOption.prototype.whenSelected = function(){
	document.body.style.cursor = "";
	this.action = NpcOption.NORMAL;
	this.visible = true;
	this.npc = null;
}

NpcOption.prototype.mouseDown = function(x, y, is_right_mb, level){
	if (is_right_mb) return;
	
	if (this.action === NpcOption.NORMAL){
		this.npc = new Npc(this.x, this.y);
		this.npc_grav_acc = this.npc.grav_acc;
		this.npc.grav_acc = 0;
		this.visible = false;
	
		level.room.entities.push(this.npc);
		
		this.is_mouse_down = true;
	}else if (this.action === NpcOption.MOVE){
		this.npc = level.room.GetEntity(x, y);
		if (this.npc === null) return;
		this.npc_grav_acc = this.npc.grav_acc;
		this.npc.grav_acc = 0;
		this.visible = false;
		this.npc.x = x;
		this.npc.y = y;
		
		document.body.style.cursor = "-webkit-grabbing";
		this.is_mouse_down = true;
	}
}

NpcOption.prototype.mouseUp = function(x, y, is_right_mb, level){
	if (this.action === NpcOption.NORMAL || this.action === NpcOption.MOVE){
		if (this.npc !== null && this.npc_grav_acc !== 0){
			this.npc.grav_acc = this.npc_grav_acc;
		}else if (is_right_mb){
			//Custom context menu!
			var canvas = document.getElementById("enchanted-canvas");
			
			var entity = level.room.GetEntity(x, y);
			if (entity !== null && entity !== undefined){
				this.context_menu = {};
				this.context_menu.menu = CtxMenu.Init(canvas);
				
				
				this.context_menu.menu.AddItem('delete entity', 
					function(entity){
						level.room.RemoveEntity(entity);
						this.context_menu.menu.Remove();
					}.bind(this, entity), 
					entity === level.player
				);
				
				
				this.context_menu.menu.Open();
			}
		}
		this.npc = null;
		if (this.action === NpcOption.NORMAL){
			this.visible = true;
		}
		
		if (this.action === NpcOption.MOVE){
			document.body.style.cursor = "-webkit-grab";
		}
	}
	
	this.is_mouse_down = false;
}

NpcOption.prototype.mouseMove = function(x, y, is_right_mb, level, is_mouse_down){
	this.x = x;
	this.y = y;
	
	if (is_mouse_down && (this.action === NpcOption.NORMAL || this.action === NpcOption.MOVE)){
		if (this.npc !== null){
			this.npc.x = this.x;
			this.npc.y = this.y;
		}
	}else{
		var npc = level.room.GetEntity(x, y);
		if (npc === null){
			document.body.style.cursor = "";
			this.action = NpcOption.NORMAL;
			this.visible = true;
		}else{
			document.body.style.cursor = "-webkit-grab";
			this.visible = false;
			
			this.action = NpcOption.MOVE;
		}
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