function Player(x, y, z, facing){
	GameMover.call(this, x, y, z, [0.0, 0.5, 0.0, 0.5, 0.0, 0.5], "player_grey_sheet");
	this.type = "Player";
	
	this.facing = facing;
}

Player.prototype.Import = function(obj){
	GameMover.prototype.Import.call(this, obj);
}

Player.prototype.Export = function(){
	var obj = GameMover.prototype.Export.call(this);
	obj.img_name = "player_grey_sheet";
	return obj;
}
Player.prototype.Update = function(delta, plane_manager, entity_manager){
	//this.DieToSpikesAndStuff(plane_manager, entity_manager);
	GameMover.prototype.Update.call(this, delta, plane_manager, entity_manager);
}

Player.prototype.DieToSpikesAndStuff = function(tile_manager, entity_manager){
	var q = 3;
	var x = this.x;
	var y = this.y;
	var lb = this.lb;
	var tb = this.tb;
	var rb = this.rb;
	var bb = this.bb;
	var entities = entity_manager.GetEntities();
	for (var i = 0; i < entities.length; i++){
		if (entities[i].kill_player && (this.IsRectColliding(entities[i], x+lb+q, y+tb+q,x+rb-q,y+bb-q))){
			this.Die();
			return;
		}
	}

	//Colliding with spikes
	var left_tile = Math.floor((this.x + this.lb + this.vel.x - 1) / Tile.WIDTH);
	var right_tile = Math.ceil((this.x + this.rb + this.vel.x + 1) / Tile.WIDTH);
	var top_tile = Math.floor((this.y + this.tb + this.vel.y - 1) / Tile.HEIGHT);
	var bottom_tile = Math.ceil((this.y + this.bb + this.vel.y + 1) / Tile.HEIGHT);
	
	for (var i = top_tile; i <= bottom_tile; i++){
		for (var j = left_tile; j <= right_tile; j++){
			var tile = tile_manager.GetTile(j, i);
			if (tile === null) continue;
			if (tile.collision != Tile.KILL_PLAYER && !tile.kill_player) continue;
			
			if (this.IsRectColliding(tile, x+lb+q, y+tb+q,x+rb-q,y+bb-q)){
				this.Die();
				return;
			}
		}
	}
}

Player.prototype.Die = function(){
	Utils.playSound("hurt", master_volume, 0);
	room_manager.RevivePlayer();
}

extend(GameMover, Player);