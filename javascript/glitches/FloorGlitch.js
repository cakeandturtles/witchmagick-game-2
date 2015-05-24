function FloorGlitch(){
	Glitch.call(this);
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
			}
			
			// Reset flag to search for ground collision.
			this.was_on_ground = this.on_ground;
			//this.on_ground = false;
		}
	});
}
extend(Glitch, FloorGlitch);