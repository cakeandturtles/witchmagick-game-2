//TODO:: I think this currently only works with one glitch per function per vessel
function Glitch(){
	this.glitches = [];
	
	this.type = "";
}
Glitch.prototype.HasAType = function(){
	return this.type !== undefined && this.type !== null && this.type.length > 0;
}
Glitch.suffix = "_unglitched";

//pass a single object/entity to glitch that object/entity
//pass a prototype to glitch the entire class
Glitch.prototype.apply = function(vessel){
	for (var i = 0; i < this.glitches.length; i++){
		var glitch = this.glitches[i];
		//only apply if it hasn't already been applied??
		if (vessel[glitch.funcName + Glitch.suffix] === undefined){
			//before applying, remember the old so we can revert
			vessel[glitch.funcName + Glitch.suffix] = vessel[glitch.funcName];
			vessel[glitch.funcName] = glitch.funcDef;
		}
	}
}
Glitch.prototype.applyAll = function(vessels){
	for (var i = 0; i < vessels.length; i++){
		this.apply(vessels[i]);
	}
}

Glitch.prototype.ApplyRoom = function(room){
	this.apply(room.player);
	this.applyAll(room.entities);
}

Glitch.prototype.RevertRoom = function(room){
	this.revert(room.player);
	this.revertAll(room.entities);
}

Glitch.prototype.revert = function(vessel){
	for (var i = 0; i < this.glitches.length; i++){
		var glitch = this.glitches[i];
		//will attempt to revert glitch if (_unglitched) version exists
		if (vessel[glitch.funcName + Glitch.suffix] !== undefined){
			vessel[glitch.funcName] = vessel[glitch.funcName + Glitch.suffix];
			delete vessel[glitch.funcName + Glitch.suffix];
		}
	}
}
Glitch.prototype.revertAll = function(vessels){
	for (var i = 0; i < vessels.length; i++){
		this.revert(vessels[i]);
	}
}
