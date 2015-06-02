function CtxMenu(dom, table, element){
	this.dom = dom;
	this.table = table;
	this.element = element;
	
	CtxMenu.addEventHandler(this.element, "mousedown", this.HideMe.bind(this));
	CtxMenu.addEventHandler(this.element, "mouseup", this.HideMe.bind(this));
	CtxMenu.addEventHandler(this.element, "contextmenu", this.ShowMe.bind(this));
}

CtxMenu.removeEventHandler = function(elem,eventType,handler) {
 if (elem.removeEventListener) 
    elem.removeEventListener (eventType,handler,true);
 if (elem.detachEvent)
    elem.detachEvent ('on'+eventType,handler); 
}
CtxMenu.addEventHandler = function(elem,eventType,handler) {
 if (elem.addEventListener)
     elem.addEventListener (eventType,handler,true);
 else if (elem.attachEvent)
     elem.attachEvent ('on'+eventType,handler); 
}

CtxMenu.Init = function(element){
	var dom = document.getElementById("context_menu");
	var table = document.getElementById("context_menu_table");
	if (dom === undefined || dom === null){
		dom = document.createElement("div");
		dom.id = "context_menu";
		
		table = document.createElement("table");
		table.id = "context_menu_table";
		table.border = 0;
		table.cellpadding = 0;
		table.cellspacing = 0;
		
		dom.appendChild(table);
		document.body.appendChild(dom);
	}
	dom.style.display = "none";
	table.innerHTML = "";
	
	var ctx_menu = new CtxMenu(dom, table, element);
	return ctx_menu;
}

CtxMenu.prototype.Remove = function(){
	CtxMenu.removeEventHandler(this.element, "mousedown", this.HideMe.bind(this));
	CtxMenu.removeEventHandler(this.element, "mouseup", this.HideMe.bind(this));
	CtxMenu.removeEventHandler(this.element, "contextmenu", this.ShowMe.bind(this));
	
	try{
		this.HideMe();
	}catch(e){};
}

CtxMenu.prototype.AddItem = function(label, callback, disabled){
	label = defaultTo(label, "");
	callback = defaultTo(callback, function(){});
	disabled = defaultTo(disabled, false);
	
	var item_row = document.createElement("tr");
	var item_element = document.createElement("td");
	var item = document.createElement("div");
	item.className = "context_menu_item";
	item.innerHTML = label;
	if (disabled){
		item.style.cursor = "";
		item.style.color = "#aaaaaa";
	}else{
		item.onclick = function(e){
			callback();
			this.HideMe(e);
		}.bind(this);
	}
	item_element.appendChild(item);
	item_row.appendChild(item_element);
	this.table.appendChild(item);
}

CtxMenu.prototype.ShowMe = function(e){
	var x = e.clientX + window.pageXOffset + "px";
	var y = e.clientY + window.pageYOffset + "px";
	
	this.dom.style.display = "inline";
	this.dom.style.position = "absolute";
	this.dom.style.left = x;
	this.dom.style.top = y;
	
	e.preventDefault();
	e.stopPropagation();
}

CtxMenu.prototype.HideMe = function(e){
	this.dom.style.display = "none";
	
	e.preventDefault();
	e.stopPropagation();
}

CtxMenu.prototype.Open = function(){
	var e = this.element.ownerDocument.createEvent('MouseEvents');

	e.initMouseEvent('contextmenu', true, true,
		 this.element.ownerDocument.defaultView, 1, 0, 0, 0, 0, false,
		 false, false, false, 2, null);

	!this.element.dispatchEvent(e);
}