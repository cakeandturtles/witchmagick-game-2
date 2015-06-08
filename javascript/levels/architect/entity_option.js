function EntityOption(architect, menu_dom){
	this.entity_types = [
		"Npc",
		"Checkpoint"
	];
	this.entity_type_index = 0;
	this.entity_type = this.entity_types[this.entity_type_index];
	
	Option.call(this, architect, menu_dom, "level-architect-entity", "option_entity_"+this.entity_type.toLowerCase()+".png", this.entity_type.toLowerCase()+"_sheet.png");
	
	this.is_mouse_down = false;
	this.entity_grav_acc = 0;
	this.entity = null;
	this.context_menu = {};
	this.visible = true;
	
	this.action = EntityOption.NORMAL;
}
extend(Option, EntityOption);

EntityOption.NORMAL = 0;
EntityOption.MOVE = 1;

EntityOption.prototype.whenSelected = function(){
	document.body.style.cursor = "";
	this.action = EntityOption.NORMAL;
	this.visible = true;
	this.entity = null;
}

EntityOption.prototype.onDomClick = function(){
	if (hasClass(this.dom, "selected")){
		this.entity_type_index++;
		if (this.entity_type_index >= this.entity_types.length){
			this.entity_type_index = 0;
		}
		this.entity_type = this.entity_types[this.entity_type_index];
		
		this.dom.src = "assets/images/architect_options/option_entity_" + this.entity_type.toLowerCase() + ".png";
		GLObject.prototype.initTexture.call(this, this.entity_type.toLowerCase() + "_sheet.png");
	}
}

EntityOption.prototype.mouseDown = function(x, y, is_right_mb, level){
	if (is_right_mb) return;
	
	if (this.action === EntityOption.NORMAL){
		this.entity = eval("new "+this.entity_type+"(this.x, this.y)");
		this.entity_grav_acc = this.entity.grav_acc;
		this.entity.grav_acc = 0;
		this.visible = false;
	
		level.room.entities.push(this.entity);
		
		this.is_mouse_down = true;
	}else if (this.action === EntityOption.MOVE){
		this.entity = level.room.GetEntity(x, y);
		if (this.entity === null) return;
		this.entity_grav_acc = this.entity.grav_acc;
		this.entity.grav_acc = 0;
		this.visible = false;
		this.entity.x = x;
		this.entity.y = y;
		
		document.body.style.cursor = "-webkit-grabbing";
		this.is_mouse_down = true;
	}
}

EntityOption.prototype.mouseUp = function(x, y, is_right_mb, level){
	if (this.action === EntityOption.NORMAL || this.action === EntityOption.MOVE){
		if (this.entity !== null && this.entity_grav_acc !== 0){
			this.entity.grav_acc = this.entity_grav_acc;
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
		this.entity = null;
		if (this.action === EntityOption.NORMAL){
			this.visible = true;
		}
		
		if (this.action === EntityOption.MOVE){
			document.body.style.cursor = "-webkit-grab";
		}
	}
	
	this.is_mouse_down = false;
}

EntityOption.prototype.mouseMove = function(x, y, is_right_mb, level, is_mouse_down){
	this.x = x;
	this.y = y;
	
	if (is_mouse_down && (this.action === EntityOption.NORMAL || this.action === EntityOption.MOVE)){
		if (this.entity !== null){
			this.entity.x = this.x;
			this.entity.y = this.y;
		}
	}else{
		var entity = level.room.GetEntity(x, y);
		if (entity === null){
			document.body.style.cursor = "";
			this.action = EntityOption.NORMAL;
			this.visible = true;
		}else{
			document.body.style.cursor = "-webkit-grab";
			this.visible = false;
			
			this.action = EntityOption.MOVE;
		}
	}
}

EntityOption.prototype.render = function(camera){
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