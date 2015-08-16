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
	
	//this.mouseOut();
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
	this.menu.dom.innerHTML = "";
	this.menu.options = [];
	
	//Export OPTION
	this.export_option = new ExportOption(this, this.menu.dom);
	this.menu.options.push(this.export_option);
	
	//NEW LEVEL OPTION
	this.newlevel_option = new LevelOption(this, this.menu.dom);
	this.menu.options.push(this.newlevel_option);
	
	//ROOM OPTION
	this.room_option = new RoomOption(this, this.menu.dom);
	this.menu.options.push(this.room_option);
	
	//GLITCH OPTION
	this.glitch_option = new GlitchOption(this, this.menu.dom);
	this.menu.options.push(this.glitch_option);
	
	//CONSOLE OPTION
	this.console_option = new ConsoleOption(this, this.menu.dom);
	this.menu.options.push(this.console_option);
	
	//SPACE HOLDER
	this.menu.options.push(new SpaceOption(this, this.menu.dom));
	
	//PAUSE OPTION
	this.menu.options.push(new PauseOption(this, this.menu.dom));
	
	//SPACE HOLDER
	this.menu.options.push(new SpaceOption(this, this.menu.dom));
	
	//CAMERA OPTION
	this.menu.options.push(new CameraOption(this, this.menu.dom));
	
	//TILE OPTION (WE'RE SELECTING THIS INITIALLY)
	this.tile_option = new TileOption(this, this.menu.dom);
	this.tile_option.SelectMe();
	this.menu.options.push(this.tile_option);
	
	//ENTITY OPTION
	//this.menu.options.push(new EntityOption(this, this.menu.dom));
	
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

LevelArchitect.prototype.canvasContextMenu = function(e){
	this.context_menu = {};
	this.context_menu.menu = CtxMenu.Init(this.x, this.y, document.body);
	
	this.context_menu.menu.Open();
	
	//glitch management
	this.context_menu.menu.AddItem('room glitch cycle',
		function(){
			this.glitch_option.onDomClick_();
		}.bind(this)
	);
	this.context_menu.menu.AddItem('next glitch (G)',
		function(){
			this.level.room.IncrementGlitchIndex();
		}.bind(this),
		this.level.room.glitches.length <= 1
	);
	this.context_menu.menu.AddItem('prev glitch (H)',
		function(){
			this.level.room.DecrementGlitchIndex();
		}.bind(this),
		this.level.room.glitches.length <= 1
	);
	
	this.context_menu.menu.AddDivider();
	
	//entity management
	this.context_menu.menu.AddItem('create entity here (T + click)',
		function(){
			var x = this.context_menu.menu.x;
			var y = this.context_menu.menu.y;
			
			var npc = new Npc(x, y);
			this.level.room.AddEntity(npc);
		}.bind(this)
	);
	
	var entity = this.level.room.GetEntity(this.x + 2, this.y + 2, 0);
	this.context_menu.menu.AddItem('clone entity (Y + click)',
		function(entity){
			var newen = eval(entity.type + ".Import(entity.Export())");
			newen.x = entity.x + entity.rb / 2;
			newen.y = entity.y;
			this.level.room.AddEntity(newen);
			
		}.bind(this, entity),
		entity === this.level.player || entity === null || entity === undefined
	);
	
	this.context_menu.menu.AddItem('delete entity (U + click)',
		function(entity){
			this.level.room.RemoveEntity(entity);
		}.bind(this, entity),
		entity === this.level.player || entity === null || entity === undefined
	);
}

LevelArchitect.prototype.detectKeyInput = function(input){
	var s = input.IsKeyPressed("s");
	if (s && s.ctrl){
		this.export_option.onDomClick_();
	}
	
	if (input.IsKeyPressed("g")){
		this.level.room.IncrementGlitchIndex();
	}
	if (input.IsKeyPressed("h")){
		this.level.room.DecrementGlitchIndex();
	}
	
	this.selected_option.detectKeyInput(input, this.level);
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
	
	if (isRightMB(e)){
		this.canvasContextMenu(mouseX, mouseY);
		this.selected_option.canvasContextMenu(this.x, this.y, this.level, mouseX, mouseY, this.context_menu);
	}
	
	this.selected_option.mouseUp(this.x, this.y, isRightMB(e), this.level, mouseX, mouseY);
}
LevelArchitect.prototype.mouseMove = function(e){
	var mouseX = e.clientX + document.body.scrollLeft;
	var mouseY = e.clientY + document.body.scrollTop;
	var zoom = this.level.room.zoom;
	var gridX = ~~((mouseX + this.level.camera.x*zoom) / (Game.TILE_SIZE * zoom));
	var gridY = ~~((mouseY + this.level.camera.y*zoom) / (Game.TILE_SIZE * zoom));
	
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