function FeatherGlitch(){
	Glitch.call(this);
	
	this.type = "FeatherGlitch";
	
	this.tile_img_name = "tile_sheet_green.png";
	
	this.glitches.push({
		init: function(vessel){
			vessel.max_run_vel = 2.5;
			vessel.gnd_run_acc = vessel.max_run_vel / 6.0;
			vessel.gnd_run_dec = vessel.max_run_vel / 10.0;
			vessel.air_run_acc = vessel.max_run_vel / 6.0;
			vessel.air_run_dec = vessel.max_run_vel / 10.0;
			
			vessel.num_jumps = 0;
			vessel.max_num_jumps = 3;
			
			vessel.grav_acc = 0.8;
			vessel.jump_vel = 4.5;
			vessel.is_jumping = false;
			vessel.jump_time_limit = 22;
			vessel.terminal_vel = 4.0;
			vessel.jump_acc = 35.0;
		}
	});
	this.glitches.push({
		funcName: "StartJump",
		funcDef: function(delta){
			if (this.on_ground || this.num_jumps < this.max_num_jumps){
				this.vel.y = -this.jump_vel / ((20*this.num_jumps)+1);
				this.is_jumping = true;
				this.jump_timer = 0;
				this.on_ground = false;
				
				this.num_jumps++;
			}
		}
	});
	this.glitches.push({
		funcName: "Jump",
		funcDef: function(delta){
			if (this.is_jumping){
				this.jump_timer += delta;
				if (this.jump_timer >= this.jump_time_limit + (this.num_jumps * 2)){
					this.jump_timer = 0;
					this.is_jumping = false;
				}else{
					this.vel.y = -this.jump_vel * (1 - (this.jump_timer / this.jump_time_limit));
				}
			}else{
				this.terminal_vel = 2.0;
			}
		}
	});
	this.glitches.push({
		funcName: "applyGravity",
		funcDef: function(delta){
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
				this.num_jumps = 0;
			}
			
			// Reset flag to search for ground collision.
			this.was_on_ground = this.on_ground;
			this.on_ground = false;
			this.terminal_vel = 4.0;
		}
	});
}
extend(Glitch, FeatherGlitch);