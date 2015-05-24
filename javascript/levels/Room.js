function Room(width, height, zoom){	
	this.width = defaultTo(width, 320);
	this.height = defaultTo(height, 240);
	this.zoom = defaultTo(zoom, 2);
	
	this.triangle = new Triangle(32, 208, 0);
	this.cube = new GL3dObject("tile.png", 64, 200, 0);
	this.tile_hydra = new TileHydra(this);
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
	this.triangle.update(delta, this);
	
	this.cube.update(delta, this);
}

Room.prototype.render = function(camera, player){
	camera.render(this.zoom, this);
	
	this.tile_hydra.render(camera);
	
	player.render(camera);
	this.triangle.render(camera);
	this.cube.render(camera);
}