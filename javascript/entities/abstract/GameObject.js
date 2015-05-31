function MoveState(){}
MoveState.STANDING = 0;
MoveState.RUNNING = 1;
MoveState.JUMPING = 2;
MoveState.FALLING = 3;

function GameObject(src, x, y, lb, tb, rb, bb){
	GLSprite.call(this, src, x, y, lb, tb, rb, bb);
	this.type = "GameObject";
	
	this.prev_coords = {x: this.x, y: this.y, z: this.z};
	
	this.vel = {x: 0, y: 0, z: 0};
	
	this.max_run_vel = 2.0;
	this.gnd_run_acc = this.max_run_vel / 3.0;
	this.gnd_run_dec = this.max_run_vel / 3.0;
	this.air_run_acc = this.max_run_vel / 3.0;
	this.air_run_dec = this.max_run_vel / 3.0;
	this.horizontal_input = false;
	
	this.grav_acc = 0.8;
	this.jump_vel = 4.5;
	this.is_jumping = false;
	this.jump_timer = 0;
	this.jump_time_limit = 15;
	this.terminal_vel = 7.0;
	this.jump_acc = 35.0;
	this.on_ground = true;
	this.was_on_ground = this.on_ground;
	this.previous_bottom = this.y + this.bb;
	
	this.left_flip_offset = 0;
	this.horizontal_collision = false;
	this.vertical_collision = false;
	this.pressing_down = false;
	this.pressed_down = false;
	this.has_double_jumped = false;
	this.stuck_in_wall = false;
	
	this.move_state = MoveState.STANDING;
	this.prev_move_state = this.move_state;	
}
extend(GLSprite, GameObject);

GameObject.prototype.ResetPosition = function(){
	GlSprite.prototype.ResetPosition.call(this);
	this.vel = {x: 0, y: 0};
	this.move_state = MoveState.STANDING;
	this.facing = this.original_facing;
}

GameObject.prototype.update = function(delta, room){
	this.applyPhysics(delta, room);
	this.prev_coords = {x: this.x, y: this.y, z: this.z};
	if (!this.on_ground){
		if (!this.was_on_ground){
			this.pressed_down = false;
		}
		if (this.vel.y < 0) 
			this.move_state = MoveState.JUMPING;
		else this.move_state = MoveState.FALLING;
	}
	this.updateAnimationFromMoveState();
	
	GLSprite.prototype.update.call(this, delta, room);
}

GameObject.prototype.applyPhysics = function(delta, room){
	var prev_pos = { x: this.x, y: this.y, z: this.z };
	
	if (!this.horizontal_input) this.stopMoving(delta);
	
	this.applyGravity(delta);
	this.handleCollisionsAndMove(delta, room);
	this.horizontal_input = false;
	
	if (this.x === prev_pos.x) this.vel.x = 0;
	if (this.y === prev_pos.y) this.vel.y = 0;
	this.previous_bottom = this.y + this.bb;
}

GameObject.prototype.applyGravity = function(delta){
	if (!this.on_ground){
		if (this.vel.y < this.terminal_vel){
			this.vel.y += (this.grav_acc * delta);
			if (this.vel.y > this.terminal_vel)
				this.vel.y = this.terminal_vel;
			
		}
		else if (this.vel.y > this.terminal_vel){
			this.vel.y -= (this.grav_acc * delta);
			if (this.vel.y < this.terminal_vel)
				this.vel.y = this.terminal_vel;
		}
	}else{
		this.vel.y = 0;
	}
	
	// Reset flag to search for ground collision.
	this.was_on_ground = this.on_ground;
	this.on_ground = false;
}

GameObject.prototype.StartJump = function(delta){
	if (this.on_ground){
		this.vel.y = -this.jump_vel;
		this.is_jumping = true;
		this.jump_timer = 0;
		this.on_ground = false;
	}
}
GameObject.prototype.Jump = function(delta){
	if (this.is_jumping){
		this.jump_timer += delta;
		if (this.jump_timer >= this.jump_time_limit){
			this.jump_timer = 0;
			this.is_jumping = false;
		}else{
			this.vel.y = -this.jump_vel * (1 - (this.jump_timer / this.jump_time_limit));
		}
	}
}
GameObject.prototype.StopJump = function(delta){
	this.is_jumping = false;
}

GameObject.prototype.MoveRight = function(delta){
	this.facing = Facing.RIGHT;
	this.horizontal_input = true;
	
	if (this.vel.x < 0) this.vel.x = 0;
	
	var acc = this.air_run_acc;
	if (this.on_ground){
		acc = this.gnd_run_acc;
		this.move_state = MoveState.RUNNING;
	}
	
	if (this.vel.x < this.max_run_vel){
		this.vel.x += acc;
		if (this.vel.x > this.max_run_vel)
			this.vel.x = this.max_run_vel;
	}
	else if (this.vel.x > this.max_run_vel){
		this.vel.x -= acc;
		if (this.vel.x < this.max_run_vel)
			this.vel.x = this.max_run_vel;
	}
}
GameObject.prototype.MoveLeft = function(delta){
	this.facing = Facing.LEFT;
	this.horizontal_input = true;
	
	if (this.vel.x > 0) this.vel.x = 0;
	
	var acc = this.air_run_acc;
	if (this.on_ground){
		acc = this.gnd_run_acc;
		this.move_state = MoveState.RUNNING;
	}
	
	if (this.vel.x > -this.max_run_vel){
		this.vel.x -= acc;
		if (this.vel.x < -this.max_run_vel)
			this.vel.x = -this.max_run_vel;
	}
	else if (this.vel.x < -this.max_run_vel){
		this.vel.x += acc;
		if (this.vel.x > -this.max_run_vel)
			this.vel.x = -this.max_run_vel;
	}
}
GameObject.prototype.MoveForward = function(delta){
	this.facing = Facing.FORWARD;
	this.horizontal_input = true;
	
	if (this.vel.z < 0) this.vel.z = 0;
	
	var acc = this.air_run_acc;
	if (this.on_ground){
		acc = this.gnd_run_acc;
		this.move_state = MoveState.RUNNING;
	}
	
	if (this.vel.z < this.max_run_vel){
		this.vel.z += acc;
		if (this.vel.z > this.max_run_vel)
			this.vel.z = this.max_run_vel;
	}
	else if (this.vel.z > this.max_run_vel){
		this.vel.z -= acc;
		if (this.vel.z < this.max_run_vel)
			this.vel.z = this.max_run_vel;
	}
}
GameObject.prototype.MoveBack = function(delta){
	this.facing = Facing.BACK;
	this.horizontal_input = true;
	
	if (this.vel.z > 0) this.vel.z = 0;
	
	var acc = this.air_run_acc;
	if (this.on_ground){
		acc = this.gnd_run_acc;
		this.move_state = MoveState.RUNNING;
	}
	
	if (this.vel.z > -this.max_run_vel){
		this.vel.z -= acc;
		if (this.vel.z < -this.max_run_vel)
			this.vel.z = -this.max_run_vel;
	}
	else if (this.vel.z < -this.max_run_vel){
		this.vel.z += acc;
		if (this.vel.z > -this.max_run_vel)
			this.vel.z = -this.max_run_vel;
	}
}

GameObject.prototype.stopMoving = function(delta){
	var dec = this.air_run_dec;
	if (this.on_ground){
		dec = this.gnd_run_dec;
		this.move_state = MoveState.STANDING;
	}
	
	if (this.vel.x > 0){
		this.vel.x -= dec;
		if (this.vel.x < 0) this.vel.x = 0;
	}
	else if (this.vel.x < 0){
		this.vel.x += dec;
		if (this.vel.x > 0) this.vel.x = 0;
	}
	
	if (this.vel.z > 0){
		this.vel.z -= dec;
		if (this.vel.z < 0) this.vel.z = 0;
	}
	else if (this.vel.z < 0){
		this.vel.z += dec;
		if (this.vel.z > 0) this.vel.z = 0;
	}
}

GameObject.prototype.handleCollisionsAndMove = function(delta, room){
	var left_tile = Math.floor((this.x + this.lb + this.vel.x - 1) / Game.TILE_SIZE);
	var top_tile = Math.floor((this.y + this.tb + this.vel.y - 1) / Game.TILE_SIZE);
	var front_tile = Math.ceil((this.z + this.fb + this.vel.z + 1) / Game.TILE_SIZE);
	var right_tile = Math.ceil((this.x + this.rb + this.vel.x + 1) / Game.TILE_SIZE);
	var bottom_tile = Math.ceil((this.y + this.bb + this.vel.y + 1) / Game.TILE_SIZE);
	var zback_tile = Math.floor((this.z + this.zb + this.vel.z - 1) / Game.TILE_SIZE);
	
	var q_horz = 2;
	var q_vert = 2;
	var floor_tile = null;
	floor_tile = this.handleHorizontalCollisions(delta, room, left_tile, top_tile, front_tile, right_tile, bottom_tile, zback_tile, q_horz);
	this.x += this.vel.x;
	this.z += this.vel.z;
	this.handleVerticalCollisions(delta, room, left_tile, top_tile, front_tile, right_tile, bottom_tile, zback_tile, q_vert);
	this.y += this.vel.y;
}

GameObject.prototype.handleHorizontalCollisions = function(delta, room, left_tile, top_tile, front_tile, right_tile, bottom_tile, zback_tile, q){
	this.horizontal_collision = false;
	var floor_tile = null;
	
	for (var i = top_tile; i <= bottom_tile; i++){
		for (var j = left_tile; j <= right_tile; j++){
			for (var k = front_tile; k >= zback_tile; k--){
				var tile = room.GetTile(i, j, k);
				if (tile === null) continue;
				
				if (!tile.isSolid()) continue;
				
				//Reset floor tile (choose the tile (below the player) that is closer to the player horizontally)
				if (floor_tile === null || (tile.y > this.y && Math.abs(tile.x-this.x) < Math.abs(floor_tile.x-this.x))){
					floor_tile = tile;
				}
				
				//Check for left collisions
				if (this.vel.x < 0 && this.isCollidingLeft(tile, q)){
					//only collide left if the slope is not negative?
					if (tile.slope >= 0){
						this.vel.x = 0;
						this.horizontal_collision = true;
						this.x = tile.x + tile.rb - this.lb;
					}
				}
				
				//Check for right collisions
				if (this.vel.x > 0 && this.isCollidingRight(tile, q)){
					//only collide right if the slope is not positive?
					if (tile.slope <= 0){
						this.vel.x = 0;
						this.horizontal_collision = true;
						this.x = tile.x + tile.lb - this.rb;
					}
				}
				
				//Check for back collisions
				if (this.vel.z < 0 && this.isCollidingBack(tile, q)){
					this.vel.z = 0;
					this.horizontal_collision = true;
					this.z = tile.z + tile.fb - this.zb;
				}
				
				//Check for forward collisions
				if (this.vel.z > 0 && this.isCollidingForward(tile, q)){
					this.vel.z = 0;
					this.horizontal_collision = true;
					this.z = tile.z + tile.zb - this.fb;
				}
			}
		}
	}
}

GameObject.prototype.handleVerticalCollisions = function(delta, room, left_tile, top_tile, front_tile, right_tile, bottom_tile, zback_tile, q){
	for (var i = top_tile; i <= bottom_tile; i++){
		for (var j = left_tile; j <= right_tile; j++){
			for (var k = front_tile; k >= zback_tile; k--){
				var tile = room.GetTile(i, j, k);
				if (tile === null) continue;
				
				if (!tile.isSolid() && !tile.isPartiallySolid())
					continue;

				//check for top collisions
				if (this.vel.y < 0 && !tile.isPartiallySolid() && this.isCollidingTop(tile, q)){
					this.vel.y = 0;
					this.y = tile.y + tile.bb - this.tb;
				}
				
				//check for bottom collisions
				if (this.vel.y >= 0 && this.isCollidingBottom(tile, q)){
					//don't count bottom collision for fallthrough platformes if we're not at the top of it or we are pressing down
					if (tile.isPartiallySolid() && (tile.y < this.y + this.bb || this.pressing_down))
						continue;
					//console.log("BOTTOM COLLISION");
					
					this.vel.y = 0;
					this.on_ground = true;
					this.has_double_jumped = false;
					this.y = tile.y + tile.tb - this.bb;
				}
			}
		}
	}
}

GameObject.prototype.updateAnimationFromMoveState = function(){
	switch (this.move_state){
		case MoveState.STANDING:
		default:
			//arguments: 
			//animation start index x, 
			//animation start index y,
			//animation number of frames
			if (this.facing === Facing.FORWARD)
				this.animation.Change(2, 0, 1);
			else if (this.facing === Facing.BACK)
				this.animation.Change(3, 0, 1);
			else 
				this.animation.Change(0, 0, 2);
			break;
		case MoveState.RUNNING:
			if (this.facing === Facing.FORWARD)
				this.animation.Change(2, 2, 2);
			else if (this.facing === Facing.BACK)
				this.animation.Change(2, 3, 2);
			else 
				this.animation.Change(0, 1, 4);
			break;
		case MoveState.JUMPING:
			if (this.facing === Facing.FORWARD)
				this.animation.Change(2, 2, 2);
			else if (this.facing === Facing.BACK)
				this.animation.Change(2, 3, 2);
			else
				this.animation.Change(0, 2, 2);
			break;
		case MoveState.FALLING:
			if (this.facing === Facing.FORWARD)
				this.animation.Change(2, 2, 2);
			else if (this.facing === Facing.BACK)
				this.animation.Change(2, 3, 2);
			else
				this.animation.Change(0, 3, 2);
			break;
	}
}

//Raw Collision functions
GameObject.prototype.isRectColliding = function(globject, lb, tb, fb, rb, bb, zb){
	return (lb <= globject.x + globject.rb &&
			rb >= globject.x + globject.lb &&
			tb <= globject.y + globject.bb &&
			bb >= globject.y + globject.tb &&
			fb >= globject.z + globject.zb &&
			zb <= globject.z + globject.fb);
}
GameObject.prototype.isCollidingLeft = function(globject, q){
	//q is sort of an offset so we don't check collision so rigidly
	//at the feet or head of the object
	var lb = this.x + this.lb + this.vel.x - 1;
	var tb = this.y + this.tb + q;
	var fb = this.z + this.fb - q;
	var rb = this.x + this.lb;
	var bb = this.y + this.bb - q;
	var zb = this.z + this.zb + q;
	
	return this.isRectColliding(globject, lb, tb, fb, rb, bb, zb);
}
GameObject.prototype.isCollidingRight = function(globject, q){
	var lb = this.x + this.rb;
	var tb = this.y + this.tb + q;
	var fb = this.z + this.fb - q;
	var rb = this.x + this.rb + this.vel.x + 1;
	var bb = this.y + this.bb - q;
	var zb = this.z + this.zb + q;
	
	return this.isRectColliding(globject, lb, tb, fb, rb, bb, zb);
}
GameObject.prototype.isCollidingTop = function(globject, q){
	var lb = this.x + this.lb + q;
	var tb = this.y + this.tb + this.vel.y - 1;
	var fb = this.z + this.fb - q;
	var rb = this.x + this.rb - q;
	var bb = this.y + this.tb;
	var zb = this.z + this.zb + q;
	
	return this.isRectColliding(globject, lb, tb, fb, rb, bb, zb);
}
GameObject.prototype.isCollidingBottom = function(globject, q){
	var lb = this.x + this.lb + q;
	var tb = this.y + this.bb;
	var fb = this.z + this.fb - q;
	var rb = this.x + this.rb - q;
	var bb = this.y + this.bb + this.vel.y + 1;
	var zb = this.z + this.zb + q;
	
	return this.isRectColliding(globject, lb, tb, fb, rb, bb, zb);
}
GameObject.prototype.isCollidingBack = function(globject, q){
	var lb = this.x + this.lb + q;
	var tb = this.y + this.tb + q;
	var fb = this.z + this.zb;
	var rb = this.x + this.rb - q;
	var bb = this.y + this.bb - q;
	var zb = this.z + this.zb + this.vel.z - 1;
	
	return this.isRectColliding(globject, lb, tb, fb, rb, bb, zb);
}
GameObject.prototype.isCollidingForward = function(globject, q){
	var lb = this.x + this.lb + q;
	var tb = this.y + this.tb + q;
	var fb = this.z + this.fb + this.vel.z + 1;
	var rb = this.x + this.rb - q;
	var bb = this.y + this.bb - q;
	var zb = this.z + this.fb;
	
	return this.isRectColliding(globject, lb, tb, fb, rb, bb, zb);
}