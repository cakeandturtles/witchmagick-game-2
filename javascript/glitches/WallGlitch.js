function WallGlitch(){
	Glitch.call(this);
	
	this.type = "WallGlitch";
	
	this.tile_img_name = "tile_sheet_gold.png";
	
	this.glitches.push({
		funcName: "handleCollisionsAndMove",
		funcDef: function(delta, room){
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
			
			if (this.horizontal_collision){
				this.vel.y = -1.5;
				this.on_ground = true;
			}else{
				this.on_ground = false;
			}
			
			this.handleVerticalCollisions(delta, room, left_tile, top_tile, front_tile, right_tile, bottom_tile, zback_tile, q_vert);
			this.y += this.vel.y;
		}
	});
}
extend(Glitch, WallGlitch);