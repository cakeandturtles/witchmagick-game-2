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
	var dx = 32;
	var dy = 16;
	
	if (this.isRectColliding(
			room.player, 
			this.x + this.lb - dx, 
			this.y + this.tb - dy,
			this.z + this.fb - dx,
			this.x + this.rb + dx,
			this.y + this.bb + dy,
			this.z + this.zb + dx
		)){
		this.talking = true;
		room.Speak(this.GetText());
	}else if (this.talking){
		this.talking = false;
		room.Speak(null);
	}
}

Npc.prototype.GetText = function(){
	return this.text;
}