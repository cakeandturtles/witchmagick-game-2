function GLAnimation(max_frame, frame_delay, frame_width, frame_height, rel_ani_x, rel_ani_y){
	this.max_frame = max_frame;
	this.frame_count = 0;
	this.frame_delay = frame_delay;
	this.original_frame_delay = frame_delay;
	this.frame_width = defaultTo(frame_width, 16);
	this.frame_height = defaultTo(frame_height, 16);
	this.rel_ani_x = defaultTo(rel_ani_x, 0);
	this.rel_ani_y = defaultTo(rel_ani_y, 0);
	this.abs_ani_x = 0;
	this.abs_ani_y = 0;
	this.x_offset = 0.25;
	this.y_offset = 0.25;
	this.animation_end = false;
	this.frame_change = false;
	this.repeat = true;
	
	this.Restart();
}

GLAnimation.prototype.Restart = function(){
	this.curr_frame = 0;
	this.frame_count = 0;
	this.animation_end = false;
	this.frame_change = false;
}

GLAnimation.prototype.Change = function(rax, ray, mf, frame_delay){
	if (frame_delay !== undefined)
		this.frame_delay = frame_delay;
	else this.frame_delay = this.original_frame_delay;
	
	if (!(this.rel_ani_x == rax && this.rel_ani_y == ray && this.max_frame == mf)){
		this.rel_ani_x = rax;
		this.rel_ani_y = ray;
		this.max_frame = mf;
		this.Restart();
	}
}

GLAnimation.prototype.update = function(delta){
	//console.log(this.frame_count);
	this.frame_change = false;
	this.animation_end = false;
	
	this.frame_count+=(delta);
	if (this.frame_count >= this.frame_delay){
		if (this.curr_frame < this.max_frame) this.curr_frame++;
		if (this.curr_frame >= this.max_frame)
		{
			if (this.repeat)
				this.curr_frame = 0;
			else this.curr_frame = this.max_frame - 1;
			this.animation_end = true;
		}
		this.frame_count = 0;
		this.frame_change = true;
	}
}

GLAnimation.prototype.normalizeAbsAniY = function(){
	return this.abs_ani_y - 1;
}

GLAnimation.prototype.getTextureCoords = function(facing){
	var ax = (this.abs_ani_x + this.rel_ani_x + this.curr_frame)*this.x_offset;
	var ay = (this.normalizeAbsAniY() - this.rel_ani_y)*this.y_offset;
	
	var textureCoords = [
	  // Front face
	  ax, ay,
	  ax+this.x_offset, ay,
	  ax, ay+this.y_offset,
	  ax+this.x_offset, ay+this.y_offset,
	];
	//need to flip the coordinates!!
	if (facing === Facing.LEFT){
		textureCoords = [
		  // Front face
		  ax+this.x_offset, ay,
		  ax, ay,
		  ax+this.x_offset, ay+this.y_offset,
		  ax, ay+this.y_offset,
		];
	}
	return textureCoords;
}