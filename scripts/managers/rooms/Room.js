function Room(width, height){
	this.width = width;
	this.height = height;
	this.tile_manager = new TileManager(this.width, this.height, true);
	this.entity_manager = {
		'GetEntities': function(){
			return [];
		}
	};
	
	this.player = new Player(width/2, height/2);
	this.camera = { x: 0, y: 0 };
}

Room.prototype.Update = function(delta){
	this.player.Update(delta, this.tile_manager, this.entity_manager);
}

Room.prototype.Render = function(ctx){
	this.player.Render(ctx, this.camera);
	
	for (var tile_coords in this.tile_manager.tiles){
		if (this.tile_manager.tiles.hasOwnProperty(tile_coords)){
			var tile = this.tile_manager.tiles[tile_coords];
			tile.Render(ctx, this.camera);
		}
	}
}