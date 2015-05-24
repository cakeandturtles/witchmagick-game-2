function CameraOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-camera", "option_camera.png", "blank.png");

	this.alpha = 0.0;
	this.x_offset = 0;
	this.y_offset = 0;
}
extend(Option, CameraOption);

CameraOption.prototype.onContextMenu = function(level){
	var self = this;
	Dialog.Alert('', "game camera");
	
	var perspective_toggle = document.createElement("div");
	var text = document.createTextNode("turn on perspective: ");
	var input = document.createElement("input");
	input.type = "checkbox";
	input.checked = !level.camera.IsOrthogonal();
	input.onchange = function(e){
		var camera = level.camera;
		if (this.checked){
			camera.CalculateMatrices = camera.CalculateMatrices_perspective;
		}else{
			camera.CalculateMatrices = camera.CalculateMatrices_orthogonal;
		}
	}
	perspective_toggle.appendChild(text);
	perspective_toggle.appendChild(input);
	
	var z_index = document.createElement("div");
	text = document.createTextNode("camera z-index: ");
	input = document.createElement("input");
	input.type = "number";
	input.step = Game.TILE_SIZE + "";
	input.value = level.camera.z;
	input.oninput = function(e){
		var number = Number(this.value);
		level.camera.z = number;
		level.camera.eye_z = number + 100;
	}
	input.style.width = "50px";
	z_index.appendChild(text);
	z_index.appendChild(input);
	
	var follow_player = document.createElement("div");
	text = document.createTextNode("follow player: ");
	input = document.createElement("input");
	input.type = "checkbox";
	input.checked = (level.camera.leader !== null);
	input.onchange = function(e){
		if (this.checked){
			level.camera.Follow(level.player);
		}else{
			level.camera.Follow(null);
		}
	}
	follow_player.appendChild(text);
	follow_player.appendChild(input);
	
	
	//Add the elements to the dialog
	Dialog.AddElement(perspective_toggle);
	Dialog.AddElement(z_index);
	Dialog.AddElement(follow_player);
}

CameraOption.prototype.mouseDown = function(x, y, is_right_mb, level, mx, my){
	this.x_offset = mx - level.camera.x;
	this.y_offset = my + level.camera.y;
	console.log(this.x_offset);
}

CameraOption.prototype.mouseMove = function(x, y, is_right_mb, level, is_mouse_down, mx, my){	
	if (is_mouse_down){
		level.camera.x = mx - this.x_offset;
		level.camera.y = -my + this.y_offset;
		
		//level.camera.x = Math.floor(level.camera.x / Game.TILE_SIZE) * Game.TILE_SIZE;
		//level.camera.y = Math.floor(level.camera.y / Game.TILE_SIZE) * Game.TILE_SIZE;
	}
}

CameraOption.prototype.mouseScroll = function(x, y, is_right_mb, level, delta){
	//scroll down
	if (delta < 0){
		level.room.zoom--;
		if (level.room.zoom < 2)
			level.room.zoom = 2;
	}
	//scroll up
	else if (delta > 0){
		level.room.zoom++;
		if (level.room.zoom > 12)
			level.room.zoom = 12;
	}
}