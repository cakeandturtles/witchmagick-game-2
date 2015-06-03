function Option(architect, menu_dom, id, dom_img_src, src){
	GLObject.call(this, src, 0, 0);
	
	this.architect = architect;
	
	//MAKE DOM ELEMENT AND APPEND TO MENU DOM!!
	this.dom = document.createElement("img");
	this.dom.id = id;
	this.dom.src = "assets/images/" + dom_img_src;
	this.dom.className = "level-architect-option";
	
	menu_dom.appendChild(this.dom);
	this.dom.onclick = this.onDomClick_.bind(this);
	this.dom.oncontextmenu = function(e){ 
		e.preventDefault(); 
		this.onContextMenu(architect.level);
		if (!this.is_selectable)
			this.SelectMe();
		return false; 
	}.bind(this);
	
	this.alpha = 0.5;
	
	this.is_selectable = true;
	this.is_toggleable = false;
}
extend(GLObject, Option);

Option.prototype.ToggleOn = function(){}
Option.prototype.ToggleOff = function(){}

Option.prototype.SelectMe = function(exclusive){
	exclusive = defaultTo(exclusive, true);
	if (exclusive){
		this.architect.selected_option = this;
		this.whenSelected();
		document.body.style.cursor = "";
	}
		
	//add the 'selected' class to the dom
	if (!hasClass(this.dom, "selected")){
		if (exclusive){
			for (var i = 0; i < this.architect.menu.options.length; i++){
				var dom = this.architect.menu.options[i].dom;
				removeClass(dom, "selected");
			}
		}
		addClass(this.dom, "selected");
		if (this.is_toggleable){
			this.ToggleOn();
		}
	}else if (this.is_toggleable){
		this.ToggleOff();
		removeClass(this.dom, "selected");
	}
	
}

Option.prototype.onDomClick_ = function(e){
	var is_right_mb = isRightMB(e);
	if (!is_right_mb){
		if (!this.is_selectable){
			this.onContextMenu(this.architect.level);
		}
		
		this.SelectMe(this.is_selectable);
	}else{
		this.onContextMenu(this.architect.level);
		this.SelectMe(this.is_selectable);
	}
}

Option.prototype.whenSelected = function(){}

Option.prototype.detectKeyInput = function(input, level){}

Option.prototype.onContextMenu = function(level){}

Option.prototype.mouseDown = function(x, y, is_right_mb, level){}

Option.prototype.mouseUp = function(x, y, is_right_mb, level){}

Option.prototype.mouseMove = function(x, y, is_right_mb, level, is_mouse_down){}

Option.prototype.mouseScroll = function(x, y, is_right_mb, level, delta){}

Option.prototype.mouseOut = function(x, y, is_right_mb, level, is_mouse_down){
	this.x = x;
	this.y = y;
}