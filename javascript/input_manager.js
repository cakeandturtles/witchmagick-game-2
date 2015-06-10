function Input(){
	this.keys_down = {};
	this.keys_up = {};
	this.keys_pressed = {};
	
	window.onkeydown = function(e){
		if (this.keys_down[e.keyCode] === undefined){
			this.keys_down[e.keyCode] = { ctrl: e.ctrlKey, shift: e.shiftKey, meta: e.metaKey, alt: e.altKey };
			this.keys_pressed[e.keyCode] = { ctrl: e.ctrlKey, shift: e.shiftKey, meta: e.metaKey, alt: e.altKey };
		}
	}.bind(this);
	
	window.onkeyup = function(e){
		delete this.keys_down[e.keyCode];
		this.keys_up[e.keyCode] = { ctrl: e.ctrlKey, shift: e.shiftKey, meta: e.metaKey, alt: e.altKey };
	}.bind(this);
}

Input.prototype.update = function(){
	this.keys_up = {};
	this.keys_pressed = {};
}

Input.prototype.IsKeyDown = function(){
	for (var i = 0; i < arguments.length; i++){
		var keyCode = this.getKeyCode(arguments[i]);
		if (this.keys_down[keyCode]){
			return this.keys_down[keyCode];
		}
	}
	return false;
}
Input.prototype.IsKeyUp = function(){
	for (var i = 0; i < arguments.length; i++){
		var keyCode = this.getKeyCode(arguments[i]);
		if (this.keys_up[keyCode]){
			return this.keys_up[keyCode];
		}
	}
	return false;
}
Input.prototype.IsKeyPressed = function(){
	for (var i = 0; i < arguments.length; i++){
		var keyCode = this.getKeyCode(arguments[i]);
		if (this.keys_pressed[keyCode]){
			return this.keys_pressed[keyCode];
		}
	}
	return false;
}

Input.prototype.getKeyCode = function(ascii){	
	switch (ascii){
		case "<": return 37;
		case ">": return 39;
		case "^": return 38;
		case "V": return 40;
		case "a": return 65;
		case "d": return 68;
		case "w": return 87;
		case "s": return 83;
		case "z": return 90;
		case " ": return 32;
		case "q": return 81;
		case "e": return 69;
		case "x": return 88;
		case "g": return 71;
		case "h": return 72;
		case "shift": return 16;
		case "ctrl": return 17;
		default: return 0;
	}
}