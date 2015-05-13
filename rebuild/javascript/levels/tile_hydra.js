//one manager for all tiles (of a certain texture???)!!!
function TileHydra(room){
	this.src = "tile.png";
	
	this.room = room;
	this.tiles = {};
	this.aggregated_tiles = [];
	
	this.tiles_changed = false;
	var y = 232;
	for (var i = 0 ; i < 320/Game.TILE_SIZE/2; i++){
		var y_index = y / Game.TILE_SIZE;
		var x_index = i;
		this.AddTile(y_index, x_index, new Tile("tile.png", i*Game.TILE_SIZE, y, Game.TILE_SIZE, Game.TILE_SIZE, Collision.SOLID), true);
	}
	y = 32;
	for (var i = 0 ; i < 64/Game.TILE_SIZE/2; i++){
		var y_index = y / Game.TILE_SIZE;
		var x_index = i;
		this.AddTile(y_index, x_index, new Tile("tile.png", i*Game.TILE_SIZE, y, Game.TILE_SIZE, Game.TILE_SIZE, Collision.SOLID), true);
	}
}

TileHydra.prototype.GetTile = function(y_index, x_index){
	var tile = null;
	if (this.tiles[y_index] !== undefined){
		if (this.tiles[y_index][x_index] !== undefined){
			tile = this.tiles[y_index][x_index];
		}
	}
	return tile;
}
TileHydra.prototype.AddTile = function(y_index, x_index, tile, suppress_aggregation){	
	if (this.tiles[y_index] === undefined)
		this.tiles[y_index] = {};
	this.tiles[y_index][x_index] = tile;
	
	this.TrySuppressAggregation(suppress_aggregation);
}
TileHydra.prototype.RemoveTile = function(y_index, x_index, suppress_aggregation){
	if (this.tiles[y_index] !== undefined){
		delete this.tiles[y_index][x_index];
		this.tiles_changed = true;
	}
	
	this.TrySuppressAggregation(suppress_aggregation);
}
TileHydra.prototype.TrySuppressAggregation = function(suppress_aggregation){
	if (suppress_aggregation === undefined || !suppress_aggregation){
		this.aggregateTiles();
		this.tile_changed = false;
	}else{
		this.tiles_changed = true;
	}
}

TileHydra.prototype.deaggregateTiles = function(){
	this.aggregated_tiles = [];
	for (var i in this.tiles){
		for (var j in this.tiles[i]){
			this.tiles[i][j].has_been_aggregated = false;
		}
	}
}

TileHydra.prototype.aggregateTiles = function(){
	//iterate from top to bottom first
	//left to right next
	//upon finding a tile that is not already part of an aggregate
		//tiles should have an has_aggregated property???
		//that is reset at the beginning of each function call here???
	//begin counting down until you reach a gap
	//then begin count right until you reach a gap
	//create a new aggregate tile of the height and width found
	//and add it to the aggregated tiles dictionary!!
		/*TODO:: if adding tiles with different texture/tilesheet positions, then they are going to have to be in different aggregates???*/
		/*TODO ADDITIONAL:: if tiles have an alpha less than 1 and more than 0 this will aggregate the alpha for overlapping rectangles!!!*/
		/*ADDITIONAL:: aggregate tile's collision types don't matter because the aggregated_tiles only are used for rendering efficiency... the collision checking in GameObject uses the this.tiles dictionary and is already locally efficient*/
	
	this.deaggregateTiles();
	var i2, j2;
	
	for (var i in this.tiles){
		i = Number(i);
		for (var j in this.tiles[i]){
			j = Number(j);
			//if we already haven't been aggregated!
			if (!this.tiles[i][j].has_been_aggregated){
				i2 = i;
				j2 = j;
				
				var prev_i2 = i2;
				var min_j2 = 9999;
				//find the longest unbroken rectangle down
				while (true){
					j2 = j;
					var prev_j2 = j2;
					//find the longest unbroken rectangle right (that is less than minimum)
					while (true){
						if (j2 >= min_j2) break;
						j2++;
						if (this.tiles[i2][j2] === undefined){
							j2--;
						}
						if (j2 === prev_j2){
							if (j2 < min_j2){
								min_j2 = j2;
							}
							break;
						}
						prev_j2 = j2;
					}
					
					i2++;
					if (this.tiles[i2] === undefined || this.tiles[i2][j] === undefined){
						i2--;
					}
					if (i2 === prev_i2) break;
					prev_i2 = i2;
				}
				j2 = min_j2;
				//once width and height have been calculated, iterate through the tiles and tell them they've been aggregated
				for (var y = i; y <= i2; y++){
					for (var x = j; x <= j2; x++){
						this.tiles[y][x].has_been_aggregated = true;
					}
				}
				//finally, create the aggregate visual tile and add it to the array
				var agg_tile = new Tile(this.src, j * Game.TILE_SIZE, i * Game.TILE_SIZE, (j2 - j + 1) * Game.TILE_SIZE, (i2 - i + 1) * Game.TILE_SIZE);
				this.aggregated_tiles.push(agg_tile);
			}
		}
	}
	
	this.tiles_changed = false;
}

TileHydra.prototype.render_allTiles = function(){
	if (this.tiles_changed){
		this.aggregateTiles();
	}
	
	for (var i = 0; i < this.aggregated_tiles.length; i++){
		this.aggregated_tiles[i].render();
	}
}
TileHydra.prototype.render_lightsOut = function(){
	var p = this.room.player;
	var left_tile = Math.floor((p.x + p.lb + p.vel.x - 1) / Game.TILE_SIZE);
	var top_tile = Math.floor((p.y + p.tb + p.vel.y - 1) / Game.TILE_SIZE);
	var right_tile = Math.ceil((p.x + p.rb + p.vel.x + 1) / Game.TILE_SIZE);
	var bottom_tile = Math.ceil((p.y + p.bb + p.vel.y + 1) / Game.TILE_SIZE);
	
	for (var i = top_tile; i <= bottom_tile; i++){
		for (var j = left_tile; j <= right_tile; j++){
			var tile = this.GetTile(i, j);
			if (tile === null) continue;
			tile.render();
		}
	}
}
TileHydra.prototype.render = TileHydra.prototype.render_allTiles;