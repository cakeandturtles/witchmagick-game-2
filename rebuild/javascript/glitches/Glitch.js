//TODO:: I think this currently only works with one glitch per function per vessel
function Glitch(){
	this.glitches = [];
}
Glitch.suffix = "_unglitched";

//pass a single object/entity to glitch that object/entity
//pass a prototype to glitch the entire class
Glitch.prototype.Apply = function(vessel){
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

Glitch.prototype.Revert = function(vessel){
	for (var i = 0; i < this.glitches.length; i++){
		var glitch = this.glitches[i];
		//will attempt to revert glitch if (_unglitched) version exists
		if (vessel[glitch.funcName + Glitch.suffix] !== undefined){
			vessel[glitch.funcName] = vessel[glitch.funcName + Glitch.suffix];
			delete vessel[glitch.funcName + Glitch.suffix];
		}
	}
}

Glitch.RevertAll = function(vessel){
	for (var key in vessel){
		if (vessel.hasOwnProperty(key) && vessel.hasOwnProperty(key + Glitch.suffix)){
			vessel[key] = vessel[key + Glitch.suffix];
			delete vessel[key + Glitch.suffix];
		}
	}
}

