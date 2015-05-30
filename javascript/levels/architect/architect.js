function LevelArchitect(canvas, input, level){
	this.x = 0;
	this.y = 0;
	
	this.selected_option = null;
	this.InitMenuOptions();
	this.input = input;
	this.level = level;
	//this paused used to determine whether the PAUSED option is clicked
	//which will pause the level (not the level editor) and prevent default dialog boxes closing from resuming the level prematurely
	this.paused = false;
	this.is_mouse_down = false;
	
	canvas.onmousedown = this.mouseDown.bind(this);
	canvas.onmouseup = this.mouseUp.bind(this);
	canvas.onmousemove = this.mouseMove.bind(this);
	canvas.onmousewheel = this.mouseScroll.bind(this);
	canvas.onmouseout = this.mouseOut.bind(this);
	
	this.mouseOut();
}

LevelArchitect.prototype.pause = function(){
	this.paused = true;
	this.level.pause();
}
LevelArchitect.prototype.tryResume = function(){
	if (!this.paused)
		this.level.resume();
}
LevelArchitect.prototype.resume = function(){
	this.paused = false;
	this.level.resume();
}

LevelArchitect.prototype.InitMenuOptions = function(){
	var architect = this;
	this.menu = {};
	this.menu.dom = document.getElementById("level-architect-menu");
	this.menu.options = [];
	
	//Export OPTION
	this.menu.options.push(new ExportOption(this, this.menu.dom));
	
	//SPACE HOLDER
	this.menu.options.push(new SpaceOption(this, this.menu.dom));
	
	//PAUSE OPTION
	this.menu.options.push(new PauseOption(this, this.menu.dom));
	
	//SPACE HOLDER
	this.menu.options.push(new SpaceOption(this, this.menu.dom));
	
	//CAMERA OPTION
	this.menu.options.push(new CameraOption(this, this.menu.dom));
	
	//TILE OPTION (WE'RE SELECTING THIS INITIALLY)
	var tile_option = new TileOption(this, this.menu.dom);
	tile_option.SelectMe();
	this.menu.options.push(tile_option);
	
	//PLAYER OPTION
	this.menu.options.push(new PlayerOption(this, this.menu.dom));
	
	/////////////////////////////////////////////////////////////////////
	var doms = Object.keys(this.menu);
	for (var i = 0; i < doms.length; i++){
		this.menu[doms[i]].onmouseover = function(e){
			if (!hasClass(this, "selected"))
				this.style.opacity = "1.0";
			else
				this.style.opacity = "";
		}
		this.menu[doms[i]].onmouseout = function(e){
			if (!hasClass(this, "selected"))
				this.style.opacity = "0.3";
			else
				this.style.opacity = "";
		}
	}
}

LevelArchitect.prototype.mouseDown = function(e){
	var mouseX = e.clientX + document.body.scrollLeft;
	var mouseY = e.clientY + document.body.scrollTop;
	this.is_mouse_down = true;
	
	this.selected_option.mouseDown(this.x, this.y, isRightMB(e), this.level, mouseX, mouseY);
}
LevelArchitect.prototype.mouseUp = function(e){
	var mouseX = e.clientX + document.body.scrollLeft;
	var mouseY = e.clientY + document.body.scrollTop;
	this.is_mouse_down = false;
	
	this.selected_option.mouseUp(this.x, this.y, isRightMB(e), this.level, mouseX, mouseY);
}
LevelArchitect.prototype.mouseMove = function(e){
	var mouseX = e.clientX + document.body.scrollLeft;
	var mouseY = e.clientY + document.body.scrollTop;
	var zoom = this.level.room.zoom;
	var gridX = ~~((mouseX + this.level.camera.x*zoom) / (Game.TILE_SIZE * zoom));
	var gridY = ~~((mouseY - this.level.camera.y*zoom) / (Game.TILE_SIZE * zoom));
	
	this.x = gridX * Game.TILE_SIZE;
	this.y = gridY * Game.TILE_SIZE;
	
	this.selected_option.mouseMove(this.x, this.y, isRightMB(e), this.level, this.is_mouse_down, mouseX, mouseY);
}
LevelArchitect.prototype.mouseScroll = function(e){
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	
	this.selected_option.mouseScroll(this.x, this.y, isRightMB(e), this.level, delta);
}
LevelArchitect.prototype.mouseOut = function(e){
	this.x = this.level.room.width;
	this.y = this.level.room.height;
	
	this.selected_option.mouseOut(this.x, this.y, this.level, isRightMB(e), this.is_mouse_down);
	this.is_mouse_down = false;
}

LevelArchitect.prototype.render = function(){	
	this.selected_option.render();
}