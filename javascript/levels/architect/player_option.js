function PlayerOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-player", "option_player.png", "sprite.png");
}
extend(Option, PlayerOption);

PlayerOption.prototype.PlacePlayer = function(level){
	level.player.x = this.x;
	level.player.y = this.y;
	level.player.vel.y = 0;
	level.player.vel.x = 0;
	level.player.vel.z = 0;
	level.player.move_state = MoveState.STANDING;
}

PlayerOption.prototype.mouseDown = function(x, y, is_right_mb, level){
	if (!is_right_mb){
		this.PlacePlayer(level);
	}
}

PlayerOption.prototype.mouseUp = function(x, y, is_right_mb, level){
	if (!is_right_mb){
		this.PlacePlayer(level);
	}
}

PlayerOption.prototype.mouseMove = function(x, y, is_right_mb, level, is_mouse_down){
	this.x = x;
	this.y = y;
	
	if (is_mouse_down && !is_right_mb){
		this.PlacePlayer(level);
	}
}