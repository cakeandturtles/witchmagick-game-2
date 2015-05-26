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
		if (!this.is_selectable)
			this.SelectMe();
		this.onContextMenu(architect.level);
		return false; 
	}.bind(this);
	
	this.alpha = 0.5;
	
	this.is_selectable = true;
}
extend(GLObject, Option);

Option.prototype.SelectMe = function(){
	this.architect.selected_option = this;
		
	//add the 'selected' class to the dom
	if (!hasClass(this.dom, "selected")){
		for (var i = 0; i < this.architect.menu.options.length; i++){
			var dom = this.architect.menu.options[i].dom;
			removeClass(dom, "selected");
		}
		addClass(this.dom, "selected");
	}
}

Option.prototype.onDomClick_ = function(e){
	var is_right_mb = isRightMB(e);
	if (!is_right_mb){
		this.SelectMe();
		if (this.is_selectable){
		}
		else{
			this.onContextMenu(this.architect.level);
		}
	}
}

Option.prototype.onContextMenu = function(level){}

Option.prototype.mouseDown = function(x, y, is_right_mb, level){}

Option.prototype.mouseUp = function(x, y, is_right_mb, level){}

Option.prototype.mouseMove = function(x, y, is_right_mb, level, is_mouse_down){}

Option.prototype.mouseScroll = function(x, y, is_right_mb, level, delta){}

Option.prototype.mouseOut = function(x, y, is_right_mb, level, is_mouse_down){
	this.x = x;
	this.y = y;
}