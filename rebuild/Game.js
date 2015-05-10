function Game(){
	this.room = new Room();
	
	this.keys_down = {};
	this.keys_up = {};
	this.keys_pressed = {};
	window.onkeydown = function(e){
		if (this.keys_down[e.keyCode] === undefined){
			this.keys_down[e.keyCode] = true;
			this.keys_pressed[e.keyCode] = true;
		}
	}.bind(this);
	window.onkeyup = function(e){
		delete this.keys_down[e.keyCode];
		this.keys_up[e.keyCode] = true;
	}.bind(this);
	
	this.camera = { 
		x: 0, y: 0,
	
		render_trackObject: function(zoom, object, room){
			var x_offset = 24;
			var y_offset = 16;
			
			var x = this.x;
			var y = this.y;
			var width = gl.viewportWidth / zoom;
			var height = gl.viewportHeight / zoom;
			
			//move the camera with the x/y offset buffers
			if (object.x + object.width + x_offset > x + width)
				x += object.x + object.width + x_offset - (x + width);
			if (object.x < x + x_offset)
				x += object.x - (x + x_offset);
			
			if (object.y + object.height + y_offset > y + height)
				y += object.y + object.height + y_offset - (y + height);
			if (object.y < y + y_offset)
				y += object.y - (y + y_offset);
			
			//correct the x and y positions so the buffer doesn't look past
			//the boundaries of the room
			if (x < 0) x = 0;
			if (x + width > room.width)
				x = room.width - width;
			if (y < 0) y = 0;
			if (y + height > room.height)
				y = room.height - height;
			
			//move the camera past room boundaries sticking to the tracked object
			//(allows for hidden paths)
			if (object.x + object.width > x + width)
				x += object.x + object.width - (x + width);
			else if (object.x < x)
				x += object.x - (x);
			
			if (object.y + object.height > y + height)
				y += object.y + object.height - (y + height);
			else if (object.y < y)
				y += object.y - (y);
			
			this.x = x;
			this.y = y;
			
			y *= -1;
			
			mat4.identity(pMatrix);
			//left, right, bottom, top, near, far, dest
			mat4.ortho(x, x+width, y-height, y, -100, 100, pMatrix);
		}
	};
}
Game.TILE_SIZE = 8;

Game.prototype.update = function(delta){
	this.room.update(delta);
	
	if (this.keys_down[39]){
		this.room.player.MoveRight();
	}
	else if (this.keys_down[37]){
		this.room.player.MoveLeft();
	}
	
	if (this.keys_pressed[38]){
		this.room.player.StartJump(delta);
	}
	else if (this.keys_down[38]){
		this.room.player.Jump(delta);
	}
	if (this.keys_up[38]){
		this.room.player.StopJump(delta);
	}
	/*if (e.keyCode === 38){
		//this.room.player.y--;
	}
	else if (e.keyCode === 40){
		//this.room.player.y++;
	}*/
	
	this.keys_up = {};
	this.keys_pressed = {};
}

Game.prototype.render = function(){	
	this.room.render(this.camera);
}