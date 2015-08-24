function Player(x, y){
	GameObject.call(this, "sprite_sheet.png", x, y, 2, 2, 14, 16);
	//this.animation.frame_height = 32;
	this.type = "Player";
}
extend(GameObject, Player);

Player.prototype.Export = function(){
	var obj = {};
	obj.x = this.x;
	obj.y = this.y;
	obj.type = this.type;
	return obj;
}

Player.Import = function(obj){
	var player = new Player(obj.x, obj.y);
	return player;
}

Player.prototype.refresh = function(){
	this.constructor(this.x, this.y);
}