function Tile(x, y, collision, x_graph, y_graph){
	//refers to location in room tile 'array'
	this.room_x = x;
	this.room_y = y;
	//refers to actual pixel position in room
	this.x = x*Tile.WIDTH;
	this.y = y*Tile.HEIGHT;
	this.lb = 0;
	this.rb = Tile.WIDTH;
	this.tb = 0;
	this.bb = Tile.HEIGHT;
	
	//one of the collision types defined below
	this.collision = collision || Tile.GHOST;
	
	//refers to tile from the tileset (from assets)
	this.tileset_x = x_graph || 0;
	this.tileset_y = y_graph || 0;
}
Tile.WIDTH = Game.TILE_SIZE;
Tile.HEIGHT = Game.TILE_SIZE;

//Collision types
Tile.GHOST = 0;
Tile.FALLTHROUGH = 1;
Tile.SOLID = 2;
Tile.SUPER_SOLID = 3;
Tile.KILL_PLAYER = 4;

Tile.prototype.Render = function(ctx, camera){
	switch (this.collision){
		case Tile.GHOST: return;
		case Tile.FALLTHROUGH:
			ctx.fillStyle = "#00ffff";
			break;
		case Tile.SOLID:
			ctx.fillStyle = "#ff00ff";
			break;
		case Tile.SUPER_SOLID:
			ctx.fillStyle = "#ffffff";
			break;
		case Tile.KILL_PLAYER:
			ctx.fillStyle = "#ff0000";
			break;
		default: return;
	}
	ctx.fillRect(~~(this.x-camera.x+0.5)*camera.zoom, 
				 ~~(this.y-camera.y+0.5)*camera.zoom,
				Tile.WIDTH*camera.zoom, Tile.HEIGHT*camera.zoom);
}

//////////////////////////////////////////////////////////TILE MANAGER
function TileManager(room_width, room_height, default_layout){
	this.room_width = room_width;
	this.room_height = room_height;
	
	this.width = ~~Math.round(room_width / Game.TILE_SIZE);
	this.height = ~~Math.round(room_height / Game.TILE_SIZE);
	
	this.tiles = {};
	if (default_layout){
		this.initDefaultTileLayout(room_width, room_height);
	}
}

//x_coord and y_coord are integers (0, 1, 2, 3) representing the position of
//the requested tile in the room, (e.g. if x, y = (1, 1), then we will below
//looking for the tile at pixel position Game.TILE_SIZE, Game.TILE_SIZE
TileManager.prototype.GetTile = function(x_coord, y_coord){
	if (x_coord < 0 || x_coord >= this.width || y_coord < 0 || y_coord >= this.height)
		return null;
	var key = x_coord + "_" + y_coord;
	if (key in this.tiles){
		return this.tiles[key];
	}
	return null;
}

TileManager.prototype.AddTile = function(x_coord, y_coord, collision, x_graph, y_graph){
	var key = x_coord + "_" + y_coord;
	this.tiles[key] = new Tile(x_coord, y_coord, collision, x_graph, y_graph);
}

TileManager.prototype.initDefaultTileLayout = function(room_width, room_height){	
	for (var i = 0; i < this.width; i++){
		for (var j = 0; j < this.height; j++){
			//Add tiles around the edge of the room
			if (i === 0 || i === this.width-1 || j === 0 || j === this.height-1){
				this.AddTile(i, j, Tile.SOLID, 0, 0);
			}
		}
	}
}