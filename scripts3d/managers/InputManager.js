function InputManager(){
	this.key_manager = new KeyManager();

	this.P1_FORWARD = KeyManager.UP;
	this.P1_RIGHT = KeyManager.RIGHT;
	this.P1_LEFT = KeyManager.LEFT;
	this.P1_JUMP = KeyManager.X;
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
	if (this.KeyDown(this.P1_FORWARD)){
		player.MoveForward(delta);
	}
	else if (this.KeyDown(this.P1_DOWN)){
		player.MoveBackward(delta);
	}
	
	if (this.KeyDown(this.P1_LEFT)){
		player.FaceLeft(delta);
	}
	if (this.KeyDown(this.P1_RIGHT)){
		player.FaceRight(delta);
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
	
	this.key_manager.ForgetKeysPressed();
}