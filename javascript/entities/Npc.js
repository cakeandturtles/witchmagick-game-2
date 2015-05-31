function Npc(x, y){
	GameObject.call(this, "npc_sheet.png", x, y, 2, 2, 14, 16);
	this.type = "Npc";
}
extend(GameObject, Npc);