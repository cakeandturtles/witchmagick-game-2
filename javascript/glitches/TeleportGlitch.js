function TeleportGlitch(){
	Glitch.call(this);
	
	this.type = "TeleportGlitch";
	
	this.tile_img_name = "tile_sheet_red.png";
}
extend(Glitch, TeleportGlitch);

TeleportGlitch.prototype.ApplyRoom = function(room){
	//this.apply(room.player);
	//this.applyAll(room.entities);
	room.level.ChangeRoom = room.level.ChangeRoomTeleport;
	room.tile_hydra.initTexture(this.tile_img_name);
}

TeleportGlitch.prototype.RevertRoom = function(room){
	//this.revert(room.player);
	//Glitch.refresh(room.player);
	//this.revertAll(room.entities);
	//Glitch.refreshAll(room.entities);
	room.level.ChangeRoom = room.level.ChangeRoomProper;
	room.tile_hydra.initTexture("tile_sheet.png");
}