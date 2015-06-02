function Npc(x, y){
	GameObject.call(this, "npc_sheet.png", x, y, 2, 2, 14, 16);
	this.type = "Npc";
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