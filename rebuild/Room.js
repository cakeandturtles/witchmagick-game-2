function Room(){
	this.player = new GameObject("sprite.png", 0, 0, 0, 0, 16, 16);
	this.triangle = new Triangle(32, 208, 0);
	this.tiles = {};
	
	var y = 232;
	for (var i = 0 ; i < 320/Game.TILE_SIZE/2; i++){
		var y_index = y / Game.TILE_SIZE;
		var x_index = i;
		this.AddTile(y_index, x_index, new Tile("tile.png", i*Game.TILE_SIZE, y, Collision.SOLID));
	}
}

Room.prototype.GetTile = function(y_index, x_index){
	var tile = null;
	if (this.tiles[y_index] !== undefined){
		if (this.tiles[y_index][x_index] !== undefined){
			tile = this.tiles[y_index][x_index];
		}
	}
	return tile;
}
Room.prototype.GetAllTiles = function(){
	var tiles = [];
	//maybe could be made more efficient by using the iteration in getObjectKeys directly
	var i_indices = getObjectKeys(this.tiles);
	for (var i = 0; i < i_indices.length; i++){
		var j_indices = getObjectKeys(this.tiles[i_indices[i]]);
		for (var j = 0; j < j_indices.length; j++){
			tiles.push(this.tiles[i_indices[i]][j_indices[j]]);
		}
	}
	return tiles;
}
Room.prototype.AddTile = function(y_index, x_index, tile){
	if (this.tiles[y_index] === undefined)
		this.tiles[y_index] = {};
	this.tiles[y_index][x_index] = tile;
}

Room.prototype.update = function(delta){
	this.player.update(delta, this);
	
	this.triangle.update(delta, this);
}

var zoom = 0;
Room.prototype.render = function(){
	mat4.lookAt([0, 0, zoom], [0, 0, 0], [0, 1, 0]);
	
	this.player.render();

	this.triangle.render();
	
	var tiles = this.GetAllTiles();
	for (var i = 0; i < tiles.length; i++){
		tiles[i].render();
	}
}