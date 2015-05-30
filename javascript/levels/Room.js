function Room(width, height, zoom){	
	this.width = defaultTo(width, 320);
	this.height = defaultTo(height, 240);
	this.zoom = defaultTo(zoom, 2);
	
	this.entities = [];
	this.tile_hydra = new TileHydra(this);
}

Room.prototype.Export = function(){
	//normal entity Export functions will return objects.
	//room returns the collection of objects as json
	
	var room = {};
	room.width = this.width;
	room.height = this.height;
	room.zoom = this.zoom;
	
	room.entities = [];
	for (var i = 0; i < this.entities.length; i++){
		room.entities.push(this.entities.Export());
	}
	
	var tiles = this.tile_hydra.tiles;
	var tile_keys = Object.keys(tiles);
	room.tiles = [];
	for (var i in tile_keys){
		i = tile_keys[i];
		var tile_row_keys = Object.keys(tiles[i]);
		for (var j in tile_row_keys){
			j = tile_row_keys[j];
			var tile_row_row_keys = Object.keys(tiles[i][j]);
			for (var k in tile_row_row_keys){
				k = tile_row_row_keys[k];
				room.tiles.push(tiles[i][j][k].Export());
			}
		}
	}
	return JSON.stringify(room);
}
Room.prototype.Import = function(){
}

Room.prototype.GetTile = function(y_index, x_index, z_index){
	return this.tile_hydra.GetTile(y_index, x_index, z_index);
}
Room.prototype.AddTile = function(y_index, x_index, z_index, tile, suppress_aggregation){
	this.tile_hydra.AddTile(y_index, x_index, z_index, tile, suppress_aggregation);
}
Room.prototype.RemoveTile = function(y_index, x_index, z_index, suppress_aggregation){
	this.tile_hydra.RemoveTile(y_index, x_index, z_index, suppress_aggregation);
}
Room.prototype.DeaggregateTiles = function(){
	this.tile_hydra.deaggregateTiles();
}
Room.prototype.AggregateTiles = function(){
	this.tile_hydra.AggregateTiles();
}

Room.prototype.update = function(delta){	
}

Room.prototype.render = function(camera, player){
	camera.render(this.zoom, this);
	
	this.tile_hydra.render(camera);
	
	player.render(camera);
}