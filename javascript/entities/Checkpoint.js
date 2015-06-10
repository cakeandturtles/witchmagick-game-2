function Checkpoint(x, y){
	GameObject.call(this, "checkpoint_sheet.png", x, y, 2, 2, 14, 16);
	this.type = "Checkpoint";
	
	this.active = false;
}
extend(GameObject, Checkpoint);

Checkpoint.ACTIVE_CHECKPOINT = null;

Checkpoint.prototype.Activate = function(){
	if (Checkpoint.ACTIVE_CHECKPOINT !== null)
		Checkpoint.ACTIVE_CHECKPOINT.Deactivate();
	
	this.active = true;
	Checkpoint.ACTIVE_CHECKPOINT = this;
}
Checkpoint.prototype.Deactivate = function(){
	this.active = false;
	Checkpoint.ACTIVE_CHECKPOINT = null;
}

Checkpoint.prototype.Export = function(){
	var obj = {};
	obj.x = this.x;
	obj.y = this.y;
	obj.type = this.type;
	return obj;
}
Checkpoint.Import = function(obj){
	var checkpoint = new Checkpoint(obj.x, obj.y);
	return checkpoint;
}
Checkpoint.prototype.refresh = function(){
	var active = this.active;
	this.constructor(this.x, this.y);
	this.active = active;
}

Checkpoint.prototype.update = function(delta, room){
	if (this.isColliding(room.player)){
		this.Activate();
	}
	
	GameObject.prototype.update.call(this, delta, room);
}
Checkpoint.prototype.updateAnimationFromMoveState = function(){
	if (this.active)
		this.animation.Change(0, 0, 2);
	else
		this.animation.Change(0, 0, 1);
}