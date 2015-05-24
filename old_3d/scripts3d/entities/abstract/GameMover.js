function MoveState(){}
MoveState.STANDING = 0;
MoveState.RUNNING = 1;
MoveState.JUMPING = 2;
MoveState.FALLING = 3;

function GameMover(x, y, z, bounding_box, img_name, max_run_vel, jump_vel, terminal_vel){
	this.vel = { fwd: 0, side: 0, y: 0};
	GameSprite.call(this, x, y, z, bounding_box, img_name);
	this.type = "GameMover";
	
	this.prev_coordinates = [this.x, this.y, this.z];
	this.max_run_vel = defaultValue(max_run_vel, 0.02); //pixels/second
	this.gnd_run_acc = this.max_run_vel*2;
	this.gnd_run_dec = this.max_run_vel;
	this.air_run_acc = this.max_run_vel*2;
	this.air_run_dec = this.max_run_vel;
	this.horizontal_input = false;
	this.mult = 0;
	
	this.left_flip_offset = 0;
	this.horizontal_collision = false;
	this.vertical_collision = false;
	this.pressing_down = false;
	this.pressed_down = false;
	this.has_double_jumped = false;
	this.stuck_in_wall = false;
	
	this.grav_acc = -0.0025;//pixels/second
	this.jump_vel = defaultValue(jump_vel, 0.0282);
	this.is_jumping = false;
	this.jump_timer = 0;
	this.jump_time_limit = 20;
	this.terminal_vel = defaultValue(terminal_vel, -0.022);
	this.jump_acc = 0.109; 
	this.was_on_ground = true;
	this.on_ground = true;
	this.played_land_sound = true;
	this.previous_bottom = this.y + this.bb;
	
	this.move_state = MoveState.STANDING;
	this.prev_move_state = this.move_state;
	
	this.die_to_suffocation = false;
}
extend(GameSprite, GameMover);

GameMover.prototype.Import = function(obj){
	GameSprite.prototype.Import.call(this, obj);
	this.max_run_vel = obj.max_run_vel;
	this.jump_vel = obj.jump_vel;
	this.terminal_vel = obj.terminal_vel;
	this.facing = obj.facing || this.facing;
}
GameMover.prototype.Export = function(){
	var obj = GameSprite.prototype.Export.call(this);
	obj.max_run_vel = this.max_run_vel;
	obj.jump_vel = this.jump_vel;
	obj.terminal_vel = this.terminal_vel;
	return obj;
}

GameMover.prototype.ResetPosition = function(){
	GameObject.prototype.ResetPosition.call(this);
	this.facing = this.original_facing;
}


/** FUNCTION DEFINITIONS****************************************/
/**????????????????????????????????????????????????????????????*/
GameMover.prototype.Update = function(delta, plane_manager, entity_manager)
{
	//this.DieToSuffocation(tile_manager);
	
	//if (!this.stuck_in_wall){
		this.ApplyPhysics(delta, plane_manager, entity_manager);
		this.prev_coordinates = [this.x, this.y, this.z];
		if (!this.on_ground){
			if (!this.was_on_ground)
				this.pressed_down = false;
			if (this.vel.y < 0) this.move_state = MoveState.JUMPING;
			else this.move_state = MoveState.FALLING;
		}
	//}
	//this.UpdateAnimationFromState();
	
	GameSprite.prototype.Update.call(this, delta, plane_manager, entity_manager);
}

/*********************PHYSICS AND COLLISION DETECTIONS********************/
GameMover.prototype.DieToSuffocation = function(tile_manager){
	if (!this.die_to_suffocation) return;
	console.log("let's try to die :)!");
	this.die_to_suffocation = false;

	var left_tile = Math.floor((this.x + this.lb) / Tile.WIDTH);
	var right_tile = Math.floor((this.x + this.rb) / Tile.WIDTH);
	var top_tile = Math.floor((this.y + this.tb) / Tile.HEIGHT);
	var bottom_tile = Math.floor((this.y + this.bb) / Tile.HEIGHT);
	
	//Check all potentially colliding tiles
	var q = 3;
	var dead = false;
	var top_collision = false;
	var bottom_collision = false;
	var left_collision = false;
	var right_collision = false;
	
	for (var i = top_tile; i <= bottom_tile; i++){
		for (var j = left_tile; j <= right_tile; j++){
			var tile = tile_manager.GetTile(j, i);
			if (tile === null) continue;
			if (tile.collision === Tile.GHOST || tile.collision === Tile.FALLTHROUGH){
				continue;
			}
			
			//left collisions
			if (this.IsRectColliding(tile, this.x + this.lb,  this.y + this.tb + q, this.x + this.lb, this.y + this.bb - q)){
				left_collision = true;
				if (right_collision){
					dead = true;
					break;
				}
			}
			//right collisions
			if (this.IsRectColliding(tile, this.x + this.rb, this.y + this.tb + q, this.x + this.rb, this.y + this.bb - q)){
				right_collision = true;
				if (left_collision){
					dead = true;
					break;
				}
			}
			
			//top collisions
			if (tile.collision != Tile.FALLTHROUGH && this.IsRectColliding(tile, this.x + this.lb + q, this.y + this.tb, this.x + this.rb - q, this.y + this.tb)){
				top_collision = true;
				if (bottom_collision){
					dead = true;
					break;
				}
			}
			
			//bottom collisions
			if (this.IsRectColliding(tile, this.x + this.lb + q, this.y + this.bb, this.x + this.rb - q, this.y + this.bb)){
				bottom_collision = true;
				if (top_collision){
					dead = true;
					break;
				}
			}
		}
		if (dead) break;
	}
	console.log("dead: " + dead + ", left: " + left_collision + ", right: " + right_collision + ", top: " + top_collision + ", bottom: " + bottom_collision);
	
	if (dead){ 
		this.stuck_in_wall = true;
		//this.Die();
	}
}

GameMover.prototype.Die = function(){}

GameMover.prototype.ApplyPhysics = function(delta, plane_manager, entity_manager){
	//var prev_pos = {x: this.x, y: this.y, z: this.z};
	
	this.ApplyGravity(delta);
	
	if (!this.horizontal_input) this.MoveStop(delta);
	this.HandleCollisionsAndMove(delta, plane_manager, entity_manager);
	this.horizontal_input = false;
	
	/*if (this.x === prev_pos.x) this.vel.x = 0;
	if (this.y === prev_pos.y) this.vel.y = 0;
	if (this.z === prev_pos.z) this.vel.z = 0;
	this.previous_bottom = this.y + this.y2;*/
}

GameMover.prototype.ApplyGravity = function(delta){
	if (!this.on_ground){
		if (this.vel.y > this.terminal_vel){
			this.vel.y += (this.grav_acc * (delta));
			if (this.vel.y < this.terminal_vel) 
				this.vel.y = this.terminal_vel;
		}else if (this.vel.y < this.terminal_vel){
			this.vel.y -= (this.grav_acc * (delta));
			if (this.vel.y > this.terminal_vel)
				this.vel.y = this.terminal_vel;
		}
	}else{ this.vel.y = 0; }
}

GameMover.prototype.HandleCollisionsAndMove = function(delta, plane_manager, entity_manager){
	this.vel.fwd *= (delta);
	this.vel.y *= (delta);
	this.vel.side *= (delta);
	
	// Reset flag to search for ground collision.
	this.was_on_ground = this.on_ground;
	this.on_ground = false;
	var q_horz = 0.009; //q is used to minimize height checked in horizontal collisions and etc.
	var q_vert = 0.009;
	var floor_tile = null;
	
	//floor_tile = this.HandleHorizontalCollisions(tile_manager, entity_manager, left_tile, right_tile, top_tile, bottom_tile, q_horz, floor_tile);
	this.z += this.vel.fwd * Math.cos(degToRad(this.facing+90)) + this.vel.side * Math.cos(degToRad(this.facing));
	this.x += this.vel.fwd * Math.sin(degToRad(this.facing+90)) + this.vel.side * Math.sin(degToRad(this.facing));
	this.HandleVerticalCollisions(plane_manager, entity_manager, q_vert);
	this.y += this.vel.y;
	
	this.vel.fwd /= (delta);
	this.vel.y /= (delta);
	this.vel.side /= (delta);
}

GameMover.prototype.HandleHorizontalCollisions = function(tile_manager, entity_manager, left_tile, right_tile, top_tile, bottom_tile, q, floor_tile){
	this.horizontal_collision = false;
	//Check all potentially colliding planes
	//an efficiency filter should be applied at some point
	var planes = plane_manager.GetPlanesAsArray();
	for (var i = 0; i < planes.length; i++){
		
	}
}

GameMover.prototype.HandleVerticalCollisions = function(plane_manager, entity_manager, q){
	//Check all potentially colliding planes
	//an efficiency filter should be applied at some point
	var planes = plane_manager.GetPlanesAsArray();
	for (var i = 0; i < planes.length; i++){
		var plane = planes[i];
		if (plane === null) continue;
		
		//don't check collisions if plane is not solid
		if (plane.collision === Plane.GHOST || plane.collision === Plane.KILL_PLAYER) continue;
			
		var box = this.GetRotatedBoundingBox(true, true);			
		//check for top collision (this is assuming non rotating bodies)
		//apply the velocity to the bounding box!!!
		/*if (this.vel.y >= 0 && this.IsPlaneColliding(plane, box.coordinates, box.y_top + this.vel.y + 0.003, box.y_top)){
			this.vel.y = 0;
			//TODO GET CENTER COORDINATES (BELOW) AND CHANGE ISPLANECOLLIDING FUNCTION
			var center = getCenterOfSquare(box.coordinates);
			this.y = plane.GetYPosition(center[0], center[1]);
		}*/
		
		//check for bottom collision (also assuming non rotating bodies)
		//apply the velocity to the bounding box
		if (this.vel.y <= 0 && this.IsPlaneColliding(plane, box.coordinates, box.y_top/2, box.y_bot + this.vel.y - 0.003)){
			if (plane.collision === Plane.FALLTHROUGH && this.pressing_down)
				continue;
			
			if (!this.played_land_sound){
				//Utils.playSound("land");
				this.played_land_sound = true;
			}
			this.vel.y = 0;
			this.on_ground = true;
			this.has_double_jumped = false;
			var center = getCenterOfSquare(box.coordinates);
			this.y = plane.GetYPosition(center[0], center[1]) + 0.00001;
		}
	}
}

/******************RENDER AND ANIMATION FUNCTIONS***********************/
GameMover.prototype.UpdateAnimationFromState = function(){
	switch (this.move_state){
		case MoveState.STANDING:
			this.animation.Change(0, 0, 2);
			break;
		case MoveState.RUNNING: 
			this.animation.Change(2, 0, 4);
			if (this.prev_move_state == MoveState.FALLING || this.prev_move_state == MoveState.JUMPING)
				this.animation.curr_frame = 1;
			break;
		case MoveState.JUMPING:
			this.animation.Change(0, 1, 2);
			break;
		case MoveState.FALLING:
			this.animation.Change(4, 1, 2);
			break;
		default: break;
	}

	this.prev_move_state = this.move_state;
}

/*******************FUNCTIONS FOR MOVEMENT INPUT BY OBJECT*****************/
GameMover.prototype.MoveForward = function(delta){
	var acc;
	this.horizontal_input = true;
	if (this.on_ground){
		acc = this.gnd_run_acc;
		this.move_state = MoveState.RUNNING;
	}
	else{ acc = this.air_run_acc; }
	
	//if (this.vel.fwd < 0) this.vel.fwd = 0;
	this.vel.fwd += acc;
	if (this.vel.fwd > this.max_run_vel)
		this.vel.fwd = this.max_run_vel;
}
GameMover.prototype.MoveBackward = function(delta){
	var acc;
	this.horizontal_input = true;
	if (this.on_ground){
		acc = this.gnd_run_acc;
		this.move_state = MoveState.RUNNING;
	}
	else{ acc = this.air_run_acc; }
	
	if (this.vel.fwd > 0) this.vel.fwd = 0;
	this.vel.fwd -= acc;
	if (this.vel.fwd < -this.max_run_vel)
		this.vel.fwd = -this.max_run_vel;
}
GameMover.prototype.StrafeLeft = function(delta){
	var acc;
	this.horizontal_input = true;
	if (this.on_ground){
		acc = this.gnd_run_acc;
		this.move_state = MoveState.RUNNING;
	}
	else{ acc = this.air_run_acc; }
	
	if (this.vel.side > 0) this.vel.side = 0;
	this.vel.side -= acc;
	if (this.vel.side < -this.max_run_vel)
		this.vel.side = -this.max_run_vel;
}
GameMover.prototype.StrafeRight = function(delta){
	var acc;
	this.horizontal_input = true;
	if (this.on_ground){
		acc = this.gnd_run_acc;
		this.move_state = MoveState.RUNNING;
	}
	else{ acc = this.air_run_acc; }
	
	if (this.vel.side < 0) this.vel.side = 0;
	this.vel.side += acc;
	if (this.vel.side > this.max_run_vel)
		this.vel.side = this.max_run_vel;
}

GameMover.prototype.FaceLeft = function(delta){
	this.facing += delta*3;
	if (this.facing < 0) this.facing += 360;
	this.facing %= 360;
}
GameMover.prototype.FaceRight = function(delta){
	this.facing -= delta*3;
	if (this.facing < 0) this.facing += 360;
	this.facing %= 360;
}

GameMover.prototype.MoveStop = function(delta){
	this.mult = 0;
	var dec = this.gnd_run_dec;
	if (this.on_ground){
		this.move_state = MoveState.STANDING;
	}else{
		dec = this.air_run_dec;
	}
	
	//decel fwd
	if (this.vel.fwd > 0){
		this.vel.fwd -= (dec) * (delta);
		if (this.vel.fwd < 0) this.vel.fwd = 0;
	}else if (this.vel.fwd < 0){
		this.vel.fwd += (dec) * (delta);
		if (this.vel.fwd > 0) this.vel.fwd = 0;
	}
	//decel side
	if (this.vel.side > 0){
		this.vel.side -= (dec) * (delta);
		if (this.vel.side < 0) this.vel.side = 0;
	}else if (this.vel.side < 0){
		this.vel.side += (dec) * (delta);
		if (this.vel.side > 0) this.vel.side = 0;
	}
}

GameMover.prototype.StartJump = function(delta){
	this.played_land_sound = false;
	if (this.on_ground){
		//Utils.playSound("jump");
		this.vel.y = this.jump_vel;
		this.is_jumping = true;
		this.jump_timer = 0;
		this.on_ground = false;
	}
}

GameMover.prototype.Jump = function(delta){
	if (this.is_jumping){
		this.jump_timer+=(delta);
		if (this.jump_timer >= this.jump_time_limit){
			this.jump_timer = 0;
			this.is_jumping = false;
		}else{
			this.vel.y = this.jump_vel *  (1 - (this.jump_timer / this.jump_time_limit));
		}
	}
}

GameMover.prototype.StopJump = function(delta){
	this.is_jumping = false;
}

GameMover.prototype.PressDown = function(delta){
	this.pressing_down = true;
	this.pressed_down = true;
	this.on_ground = false;
}

GameMover.prototype.StopPressingDown = function(delta){
	this.pressing_down = false;
}

//****REWRITES OF GET ROTATED BOUNDING BOX TO ALLOW VELOCITY TO FACTOR IN***/
GameMover.prototype.GetRotatedBoundingBox = function(use_position, use_velocity){
	var v = this.BoundingBoxToVertices(use_position, use_velocity);
	return {
		coordinates: [
			//coordinates for the bottom face
			[v[0][0], v[0][2]], 
			[v[1][0], v[1][2]], 
			[v[2][0], v[2][2]], 
			[v[4][0], v[4][2]],
			//coordinates for the top face
			[v[6][0], v[6][1], v[6][2]], 
			[v[7][0], v[7][1], v[7][2]], 
			[v[8][0], v[8][1], v[8][2]], 
			[v[10][0], v[10][1], v[10][2]]
		],
		y_bot: v[0][1],
		y_top: v[6][1]
	};
}

GameMover.prototype.BoundingBoxToVertices = function(use_position, use_velocity){
	var vertices = [];
	if (use_position === undefined) use_position = true;
	if (use_velocity === undefined) use_velocity = false;
	
	var x = this.x + this.vel.side; 
	var y = this.y + this.vel.y;
	var z = this.z + this.vel.fwd;
	if (!use_velocity){
		x = this.x; y = this.y; z = this.z;
	}
	if (!use_position){
		x = 0; y = 0; z = 0;
	}
	
	var x1 = this.x1, x2 = this.x2;
	var xlen = (x2 - x1) / 2;
	var y1 = this.y1, y2 = this.y2;
	var ylen = (y2 - y1) / 2;
	var z1 = this.z1, z2 = this.z2;
	var zlen = (z2 - z1) / 2;
	
	vertices = [
		//bottom face
		vec4.fromValues(x+x1, y+y1, z+z1, 1.0), vec4.fromValues(x+x2, y+y1, z+z1, 1.0), vec4.fromValues(x+x2, y+y1, z+z2, 1.0),	
		vec4.fromValues(x+x1, y+y1, z+z1, 1.0), vec4.fromValues(x+x1, y+y1, z+z2, 1.0), vec4.fromValues(x+x2, y+y1, z+z2, 1.0),
		//top face
		vec4.fromValues(x+x1, y+y2, z+z1, 1.0), vec4.fromValues(x+x2, y+y2, z+z1, 1.0), vec4.fromValues(x+x2, y+y2, z+z2, 1.0),	
		vec4.fromValues(x+x1, y+y2, z+z1, 1.0), vec4.fromValues(x+x1, y+y2, z+z2, 1.0), vec4.fromValues(x+x2, y+y2, z+z2, 1.0),
		//back face
		vec4.fromValues(x+x1, y+y1, z+z1, 1.0), vec4.fromValues(x+x1, y+y2, z+z1, 1.0), vec4.fromValues(x+x2, y+y2, z+z1, 1.0),
		vec4.fromValues(x+x1, y+y1, z+z1, 1.0), vec4.fromValues(x+x2, y+y2, z+z1, 1.0), vec4.fromValues(x+x2, y+y1, z+z1, 1.0),
		//front face
		vec4.fromValues(x+x1, y+y1, z+z2, 1.0), vec4.fromValues(x+x1, y+y2, z+z2, 1.0), vec4.fromValues(x+x2, y+y2, z+z2, 1.0),
		vec4.fromValues(x+x1, y+y1, z+z2, 1.0), vec4.fromValues(x+x2, y+y2, z+z2, 1.0), vec4.fromValues(x+x2, y+y1, z+z2, 1.0),
		//left face
		vec4.fromValues(x+x1, y+y1, z+z1, 1.0), vec4.fromValues(x+x1, y+y2, z+z1, 1.0), vec4.fromValues(x+x1, y+y1, z+z2, 1.0),
		vec4.fromValues(x+x1, y+y1, z+z2, 1.0), vec4.fromValues(x+x1, y+y2, z+z2, 1.0), vec4.fromValues(x+x1, y+y2, z+z1, 1.0),
		//right face
		vec4.fromValues(x+x2, y+y1, z+z1, 1.0), vec4.fromValues(x+x2, y+y2, z+z1, 1.0), vec4.fromValues(x+x2, y+y1, z+z2, 1.0),
		vec4.fromValues(x+x2, y+y1, z+z2, 1.0), vec4.fromValues(x+x2, y+y2, z+z2, 1.0), vec4.fromValues(x+x2, y+y2, z+z1, 1.0)
	];
	
	//translate to the origin so rotation will happen correctly!
	var T1 = mat4.translate([], mat4.create(), [-(x + xlen), -(y + ylen), -(z + zlen)]);
	//rotate bounding box by the facing
	var R = mat4.rotateY([], mat4.identity([]), degToRad(this.facing));
	//translate back
	var T2 = mat4.translate([], mat4.create(), [x + xlen, y + ylen, z + zlen]);
	
	for (var i = 0; i < vertices.length; i++){	
		vertices[i] = matrixTimesVector(T1, vertices[i]);
		vertices[i] = matrixTimesVector(R, vertices[i]);
		vertices[i] = matrixTimesVector(T2, vertices[i]);
	}
	
	return vertices;
}