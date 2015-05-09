function Slope(){}
Slope.FLAT = 0;
Slope.LOW_POS = 2;
Slope.MID_POS = 4;
Slope.HI_POS = 6;
Slope.LOW_NEG = -2;
Slope.MID_NEG = -4;
Slope.HI_NEG = -6;

function Collision(){}
Collision.GHOST = -1;
Collision.SOLID = 0;
Collision.SUPER_SOLID = 1;
Collision.FALLTHROUGH = 2;
Collision.KILL_PLAYER = 3;

function Tile(src, x, y, collision, slope, slope_index){
	GLObject.call(this, src, x, y, 0, 0, 0, Game.TILE_SIZE, Game.TILE_SIZE, Game.TILE_SIZE, Game.TILE_SIZE);
	this.type = "Tile";
	this.collision = defaultTo(collision, Collision.GHOST);
	this.slope = defaultTo(slope, Slope.FLAT);
	this.slope_index = defaultTo(slope_index, 0);
	switch (this.slope){
		case Slope.LOW_POS: case Slope.LOW_NEG:
			this.slope_index %= 4;
			break;
		case Slope.MID_POS: case Slope.MID_NEG:
			this.slope_index %= 2;
			break;
		case Slope.HI_POS: case Slope.HI_NEG:
			this.slope_index %= 4;
			break;
		default:
			this.slope_index %= 1;
	}
	
	this.setSideHeights();
}
extend(GLObject, Tile);

Tile.prototype.isSolid = function(){
	return (this.collision === Collision.SOLID || this.collision === Collision.SUPER_SOLID);
}
Tile.prototype.isPartiallySolid = function(){
	return (this.collision === Collision.FALLTHROUGH);
}

Tile.prototype.setSideHeights = function(){
	var height_offset = Math.tan(degToRad(this.slope)) * Game.TILE_SIZE;
	
	switch (this.slope){
		case Slope.LOW_POS: case Slope.MID_POS: case Slope.HI_POS:
			this.height_offsets = {
				left: Game.TILE_SIZE - (this.slope_index * height_offset),
				right: Game.TILE_SIZE - ((this.slope_index + 1) * height_offset)
			};
			break;
		case Slope.LOW_NEG: case Slope.MID_NEG: case Slope.HI_NEG:
			this.height_offsets = {
				left: Game.TILE_SIZE - (this.slope_index * height_offset),
				right: Game.TILE_SIZE - ((this.slope_index * height_offset))
			};
			break;
		case Slope.FLAT:
		default:
			this.height_offsets = { left: 0, right: 0};
			break;
	}
}