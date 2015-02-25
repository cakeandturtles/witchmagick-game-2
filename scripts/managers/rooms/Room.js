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
	this.camera = new Camera(0, 0, 1);
	this.camera.Track(this.player);
}

Room.prototype.Update = function(delta){
	this.player.Update(delta, this.tile_manager, this.entity_manager);
	this.camera.Update(delta, this.width, this.height);
}

Room.prototype.Render = function(ctx){	
	for (var tile_coords in this.tile_manager.tiles){
		if (this.tile_manager.tiles.hasOwnProperty(tile_coords)){
			var tile = this.tile_manager.tiles[tile_coords];
			tile.Render(ctx, this.camera);
		}
	}
	
	this.player.Render(ctx, this.camera);
}