function Room(player, width, height, zoom){	
	this.width = defaultTo(width, 320);
	this.height = defaultTo(height, 240);
	this.zoom = defaultTo(zoom, 2);
	
	this.glitches = [];
	this.glitch_index = -1;
	
	this.player = player;
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
	
	//export entities
	room.entities = [];
	for (var i = 0; i < this.entities.length; i++){
		room.entities.push(this.entities[i].Export());
	}
	
	//export glitches
	room.glitches = [];
	for (var i = 0; i < this.glitches.length; i++){
		if (this.glitches[i].HasAType())
			room.glitches.push({type: this.glitches[i].type});
		//add support for custom, classless glitches
		else
			room.glitches.push({type: undefined, glitches: this.glitches[i].glitches});
	}
	
	//export tiles
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
Room.Import = function(obj, player){
	var room = new Room(player, obj.width, obj.height, obj.zoom);
	
	//import entities
	for (var i = 0; i < obj.entities.length; i++){
		var entitity = obj.entities[i];
		room.entities.push(eval(entitity.type+".Import(entitity)"));
	}
	
	//import glitches
	for (var i = 0; i < obj.glitches.length; i++){
		var glitch = obj.glitches[i];
		if (glitch.type !== undefined)
			room.glitches.push(eval("new " + glitch.type+"()"));
		else{
			var new_glitch = new Glitch();
			new_glitch.glitches = glitch.glitches;
			room.glitches.push(new_glitch);
		}
	}
	
	//import tiles

}

Room.prototype.AddGlitch = function(glitch){
	this.glitches.push(glitch);
	if (this.glitch_index < 0) this.glitch_index = 0;
}
Room.prototype.RemoveGlitch = function(glitch){
	for (var i = 0; i < this.glitches.length; i++){
		if (this.glitches[i] === glitch){
			this.glitches.splice(i, 1);
			break;
		}
	}
	if (this.glitches.length === 0)
		this.glitch_index = -1;
}
Room.prototype.ClearGlitches = function(){
	this.glitches = [];
	this.glitch_index = -1;
}

Room.prototype.GetEntity = function(x, y){
	var p = this.player;
	if (x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height){
		return p;
	}
	
	for (var i = 0; i < this.entities.length; i++){
		var e = this.entities[i];
		if (x >= e.x && x <= e.x + e.width && y >= e.y && y <= e.y + e.height){
			return e;
		}
	}
	return null;
}
Room.prototype.RemoveEntity = function(x, y, entity){
	if (isNaN(Number(x)))
		entity = x;
	
	if (entity === undefined){
		for (var i = 0; i < this.entities.length; i++){
			var e = this.entities[i];
			if (x >= e.x && x <= e.x + e.width && y >= e.y && y <= e.y + e.height){
				this.entities.splice(i, 1);
				break;
			}
		}
	}else{
		for (var i = 0; i < this.entities.length; i++){
			if (this.entities[i] === entity){
				this.entities.splice(i, 1);
				break;
			}
		}
	}
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
	this.player.update(delta, this);
	for (var i = 0; i < this.entities.length; i++){
		this.entities[i].update(delta, this);
	}
}

Room.prototype.render = function(camera){
	camera.render(this.zoom, this);
	
	this.tile_hydra.render(camera);
	
	for (var i = 0; i < this.entities.length; i++){
		this.entities[i].render(camera);
	}
	
	this.player.render(camera);
}