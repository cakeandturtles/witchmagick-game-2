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

InputManager.prototype.Update = function(delta, player){
	if (this.KeyDown(this.P1_RIGHT)){
		player.MoveRight(delta);
	}
	else if (this.KeyDown(this.P1_LEFT)){
		player.MoveLeft(delta);
	}
	
	if (this.KeyPressed(this.P1_JUMP)){
		player.StartJump(delta);
	}
	else if (this.KeyDown(this.P1_JUMP)){
		player.Jump(delta);
	}
	if (this.KeyUp(this.P1_JUMP)){
		player.StopJump(delta);
	}
	
	if (this.KeyPressed(this.P1_DOWN)){
		player.PressDown(delta);
	}
	else if(this.KeyUp(this.P1_DOWN)){
		player.StopPressingDown(delta);
	}
	
	this.key_manager.ForgetKeysPressed();
}