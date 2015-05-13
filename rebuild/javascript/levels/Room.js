function Room(width, height, zoom){	
	this.width = defaultTo(width, 320);
	this.height = defaultTo(height, 240);
	this.zoom = defaultTo(zoom, 2);

	this.player = new GameObject("sprite_sheet.png", 0, 0, 0, 0, 16, 16);
	this.triangle = new Triangle(32, 208, 0);
	this.tile_hydra = new TileHydra(this);
}

Room.prototype.GetTile = function(y_index, x_index){
	return this.tile_hydra.GetTile(y_index, x_index);
}
Room.prototype.AddTile = function(y_index, x_index, tile, suppress_aggregation){
	this.tile_hydra.AddTile(y_index, x_index, tile, suppress_aggregation);
}
Room.prototype.RemoveTile = function(y_index, x_index, suppress_aggregation){
	this.tile_hydra.RemoveTile(y_index, x_index, suppress_aggregation);
}

Room.prototype.update = function(delta){
	this.player.update(delta, this);
	
	this.triangle.update(delta, this);
}

Room.prototype.render = function(camera){
	camera.render_trackObject(this.zoom, this.player, this);
	
	this.tile_hydra.render();
	
	this.player.render();
	this.triangle.render();
}