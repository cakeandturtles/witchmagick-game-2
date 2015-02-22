function InputManager(){
	this.key_manager = new KeyManager();

	this.P1_RIGHT = KeyManager.RIGHT;
	this.P1_LEFT = KeyManager.LEFT;
	this.P1_JUMP = KeyManager.UP;
	this.P1_DOWN = KeyManager.DOWN;
}

InputManager.prototype.KeyDown = function(key){
	return this.key_manager.keys_down[key];
}

InputManager.prototype.KeyUp = function(key){
	return this.key_manager.keys_up[key];
}

InputManager.prototype.KeyPressed = function(key){
	return this.key_manager.keys_pressed[key];
}

InputManager.prototype.Update = function(player){
	if (this.KeyDown(this.P1_RIGHT)){
		player.MoveRight();
	}
	else if (this.KeyDown(this.P1_LEFT)){
		player.MoveLeft();
	}
	
	if (this.KeyPressed(this.P1_JUMP)){
		player.StartJump();
	}
	else if (this.KeyDown(this.P1_JUMP)){
		player.Jump();
	}
	if (this.KeyUp(this.P1_JUMP)){
		player.StopJump();
	}
	
	if (this.KeyPressed(this.P1_DOWN)){
		player.PressDown();
	}
	else if(this.KeyUp(this.P1_DOWN)){
		player.StopPressingDown();
	}
}