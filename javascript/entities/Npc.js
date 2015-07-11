function Npc(x, y){
	GameObject.call(this, "npc_sheet.png", x, y, 2, 2, 14, 16);
	this.type = "Npc";
	
	this.talking = false;
	this.text = "Welcome to Glitch Dungeon";
}
extend(GameObject, Npc);

Npc.prototype.Export = function(){
	var obj = {};
	obj.x = this.x;
	obj.y = this.y;
	obj.type = this.type;
	return obj;
}

Npc.Import = function(obj){
	var npc = new Npc(obj.x, obj.y);
	return npc;
}

Npc.prototype.refresh = function(){
	this.constructor(this.x, this.y);
}

Npc.prototype.update = function(delta, room){
	var dx = 16;
	var dy = 8;
	var dz = dx;
	
	if (this.isRectColliding(room.player, 
			this.lb + this.x - dx, 
			this.tb + this.y - dy, 
			this.fb + this.z + dz, 
			this.rb + this.x + dx, 
			this.bb + this.y + dy, 
			this.zb + this.z - dz)){
		this.talking = true;
		room.Speak(this.GetText());

		var midx = this.x + this.lb + this.rb / 2;
		var pidx = room.player.x + room.player.lb + room.player.rb / 2;
		if (pidx > midx) this.facing = Facing.RIGHT;
		else this.facing = Facing.LEFT;
	}else if (this.talking){
		this.talking = false;
		room.Speak(null);
	}

	GameObject.prototype.update.call(this, delta, room);
}

Npc.prototype.GetText = function(){
	return this.text;
}