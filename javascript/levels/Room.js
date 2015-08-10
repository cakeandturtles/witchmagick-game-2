function Room(player, y, x, z, width, height, zoom){
	this.y = y;
	this.x = x;
	this.z = z;

	this.width = Number(defaultTo(width, 320));
	this.height = Number(defaultTo(height, 240));
	this.zoom = Number(defaultTo(zoom, 2));
	
	//this.colspan = this.width / Room.STD_WIDTH;
	//this.rowspan = this.height / Room.STD_HEIGHT;
	
	this.glitches = [];
	this.glitch_index = -1;
	
	this.level;
	this.player = player;
	this.entities = [];
	this.tile_hydra = new TileHydra(this);
}
Room.STD_WIDTH = 80;
Room.STD_HEIGHT = 64;

Room.prototype.Export = function(){
	//normal entity Export functions will return objects.
	//room returns the collection of objects as json
	
	var room = {};
	room.y = this.y;
	room.x = this.x;
	room.z = this.z;
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
	for (var ii = 0; ii < tile_keys.length; ii++){
		i = tile_keys[ii];
		var tile_row_keys = Object.keys(tiles[i]);
		for (var jj = 0; jj < tile_row_keys.length; jj++){
			j = tile_row_keys[jj];
			var tile_row_row_keys = Object.keys(tiles[i][j]);
			for (var kk = 0; kk < tile_row_row_keys.length; kk++){
				k = tile_row_row_keys[kk];
				room.tiles.push(tiles[i][j][k].Export());
			}
		}
	}
	return room;
}
Room.Import = function(obj, player){
	var room = new Room(player, obj.y, obj.x, obj.z, obj.width, obj.height, obj.zoom);
	
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
	for (var i = 0; i < obj.tiles.length; i++){
		var tile = Tile.Import(obj.tiles[i]);
		room.AddTile(tile.y_index, tile.x_index, tile.z_index, tile, true);
	}
	room.AggregateTiles();
	
	if (room.glitches.length > 0)
		room.SetGlitchIndex(0);
	return room;
}

Room.prototype.Init = function(player, level){
	this.player = player;
	this.level = level;
}
Room.prototype.InitFloor = function(){	
	var y_index = (this.height - Game.TILE_SIZE) / Game.TILE_SIZE;
	for (var i = 0; i < this.width / Game.TILE_SIZE; i++){
		this.AddTile(y_index, i, 0, new Tile(i*Game.TILE_SIZE, y_index*Game.TILE_SIZE, 0), true);
	}
	this.AggregateTiles();
}

Room.prototype.Speak = function(text, timer){
	this.level.Speak(text, timer);
}

Room.prototype.AddGlitch = function(glitch){
	this.glitches.push(glitch);
	if (this.glitch_index < 0){
		this.glitch_index = 0;
		glitch.ApplyRoom(this);
	}
}
Room.prototype.SetGlitchIndex = function(index){
	if (this.glitches.length === 0) return;
	if (index >= this.glitches.length){
		index %= this.glitches.length;
	}
	while (index < 0){
		index += this.glitches.length;
	}
	
	if (this.glitch_index >= 0)
		this.glitches[this.glitch_index].RevertRoom(this);
	this.glitch_index = index;
	this.glitches[index].ApplyRoom(this);
}
Room.prototype.IncrementGlitchIndex = function(){
	this.SetGlitchIndex(this.glitch_index+1);
}
Room.prototype.DecrementGlitchIndex = function(){
	this.SetGlitchIndex(this.glitch_index-1);
}
Room.prototype.RemoveGlitch = function(glitch){
	for (var i = 0; i < this.glitches.length; i++){
		if (this.glitches[i] === glitch){
			this.glitches.splice(i, 1);
			break;
		}
	}
	if (this.glitches.length === 0){
		this.glitch_index = -1;
		glitch.RevertRoom(this);
	}
	return glitch;
}
Room.prototype.ClearGlitches = function(){
	if (this.glitch_index > 0)
		this.glitches[this.glitch_index].RevertRoom(this);
	
	this.glitches = [];
	this.glitch_index = -1;
}

Room.prototype.AddEntity = function(entity){
	this.entities.push(entity);
}
Room.prototype.BringEntityToFront = function(entity){
	this.AddEntity(this.RemoveEntity(entity));
}
Room.prototype.GetEntity = function(x, y, z){
	if (this.player.isPointColliding(x, y, z)){
		return this.player;
	}
	
	for (var i = this.entities.length-1; i >= 0; i--){
		var e = this.entities[i];
		if (e.isPointColliding(x, y, z)){
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
		for (var i = this.entities.length-1; i >= 0; i--){
			if (this.entities[i] === entity){
				this.entities.splice(i, 1);
				break;
			}
		}
	}
	return entity;
}

Room.prototype.GetTile = function(y_index, x_index, z_index){
	return this.tile_hydra.GetTile(y_index, x_index, z_index);
}
Room.prototype.AddTile = function(y_index, x_index, z_index, tile, suppress_aggregation){
	this.tile_hydra.AddTile(y_index, x_index, z_index, tile, suppress_aggregation);
}
Room.prototype.RemoveTile = function(y_index, x_index, z_index, suppress_aggregation){
	return this.tile_hydra.RemoveTile(y_index, x_index, z_index, suppress_aggregation);
}
Room.prototype.DeaggregateTiles = function(){
	this.tile_hydra.deaggregateTiles();
}
Room.prototype.AggregateTiles = function(){
	this.tile_hydra.AggregateTiles();
}

Room.prototype.CheckChangeRoom = function(){
	if (this.player.x + this.player.rb > this.width){
		this.level.ChangeRoom(0, 1, 0, true);
	}
	else if (this.player.x < 0){
		this.level.ChangeRoom(0, -1, 0, true);
	}
	else if (this.player.y + this.player.bb > this.height)
		this.level.ChangeRoom(1, 0, 0, true);
	else if (this.player.y < 0)
		this.level.ChangeRoom(-1, 0, 0, true);
}

Room.prototype.update = function(delta){
	this.player.update(delta, this);
	this.CheckChangeRoom();
	for (var i = 0; i < this.entities.length; i++){
		this.entities[i].update(delta, this);
	}
}

Room.prototype.render = function(camera, bg_ctx){
	camera.render(this.zoom, this);
	bg_ctx.clearRect(0, 0, Game.GAME_WIDTH, Game.GAME_HEIGHT);
	bg_ctx.fillStyle = "#000000";
	
	var x = 0, y = 0;
	if (camera.x < 0)
		x = Math.abs(camera.x * this.zoom);
	if (camera.y > 0)
		y = Math.abs(camera.y * this.zoom);
	bg_ctx.fillRect(x, y, this.width*this.zoom, this.height*this.zoom);
	
	this.tile_hydra.render(camera);
	
	for (var i = 0; i < this.entities.length; i++){
		this.entities[i].render(camera);
	}
	
	this.player.render(camera);
}