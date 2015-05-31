function Player(x, y){
	GameObject.call(this, "sprite_sheet.png", x, y, 2, 2, 14, 16);
	this.type = "Player";
}
extend(GameObject, Player);