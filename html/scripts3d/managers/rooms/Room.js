function Room(width, height, depth){
	this.width = width;
	this.height = height;
	this.depth = depth;
	this.plane_manager = new PlaneManager(this.width, this.height, this.depth, true);
	this.entity_manager = {
		'GetEntities': function(){
			return [];
		}
	};
	
	//this.player = new Player(width/2, height/2, depth/2);
	this.camera = new Camera([0, 0, 0], 2);
	this.camera.Track(this.player);
}

Room.prototype.Update = function(delta){
	//this.player.Update(delta, this.plane_manager, this.entity_manager);
	//this.camera.Update(delta, this.width, this.height);
}

Room.prototype.Render = function(){	
	/*for (var tile_coords in this.tile_manager.tiles){
		if (this.tile_manager.tiles.hasOwnProperty(tile_coords)){
			var tile = this.tile_manager.tiles[tile_coords];
			tile.Render(ctx, this.camera);
		}
	}*/
	for (var plane_key in this.plane_manager.planes){
		if (this.plane_manager.planes.hasOwnProperty(plane_key)){
			var plane = this.plane_manager.planes[plane_key];
			plane.Render();
		}
	}
	
	//this.player.Render();
}