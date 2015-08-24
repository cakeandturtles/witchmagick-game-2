Dialog.prototype.removeEventHandler = function(elem,eventType,handler) {
 if (elem.removeEventListener)
    elem.removeEventListener (eventType,handler,false);
 if (elem.detachEvent)
    elem.detachEvent ('on'+eventType,handler);
}
Dialog.prototype.addEventHandler = function(elem,eventType,handler) {
 if (elem.addEventListener)
     elem.addEventListener (eventType,handler,false);
 else if (elem.attachEvent)
     elem.attachEvent ('on'+eventType,handler);
}

Dialog.prototype.Close = function(){
	try{
		this.closeDialogButton.onclick();
	}catch(error){}
}
Dialog.prototype._close = function(){
	try{
		document.body.removeChild(this.dialog);
	}catch(error){}
}

Dialog.prototype.AddElement = function(element){
	this.dialogBody.appendChild(element);
}

Dialog.prototype.Alert = function(content, title, close_callback, enter_to_close){
	if (title === undefined) title = "";
	if (enter_to_close === undefined) enter_to_close = true;
	
	this.dialog = document.createElement("div");
	this.dialog.id = "dialog";
	
	this.dialogTitle = document.createElement("div");
	this.dialogTitle.id = "dialogTitle";
	this.titleText = document.createElement("span");
	this.titleText.id = "titleText";
	this.titleText.innerHTML = title;
	this.closeDialogButton = document.createElement("div");
	this.closeDialogButton.id = "closeDialogButton";
	this.closeDialogButton.title = "Close the dialog";
	this.closeDialogButton.innerHTML = " X ";
	this.dialogTitle.appendChild(this.titleText);
	this.dialogTitle.appendChild(this.closeDialogButton);
	this.dialog.appendChild(this.dialogTitle);
	
	this.dialogBody = document.createElement("div");
	this.dialogBody.id = "dialogBody";
	this.dialogBody.innerHTML = content;
	this.dialog.appendChild(this.dialogBody);
	
	this.dialogConfirm = document.createElement("div");
	this.dialogConfirm.id = "dialogConfirm";
	this.dialogConfirm.innerHTML = "OK";
	this.dialog.appendChild(this.dialogConfirm);
	
	//set up event handlers
	this.dialogTitle.onmousedown = function(e){
		document.getElementsByTagName("html")[0].style.cursor = "default";
		document.getElementsByTagName("body")[0].style.cursor = "default";
	
		this.dialog.offY= e.clientY-parseInt(this.dialog.offsetTop);
		this.dialog.offX= e.clientX-parseInt(this.dialog.offsetLeft);
		this.addEventHandler(window, "mousemove", this.move);
	}.bind(this);
	this.dialogTitle.onmouseup = function(e){
		document.getElementsByTagName("html")[0].style.cursor = "";
		document.getElementsByTagName("body")[0].style.cursor = "";
		this.removeEventHandler(window, "mousemove", this.move);
	}.bind(this);
	var keyupHandler = function(e){
		if (e.keyCode === 13 || e.keyCode === 27){
			this.closeDialogButton.onclick();
		}
	}.bind(this);
	this.closeDialogButton.onclick = function(e){
		this._close();
		this.removeEventHandler(window, 'keyup', keyupHandler);
		if (typeof(close_callback) === "function")
			close_callback();
	}.bind(this);
	this.dialogConfirm.onclick = function(e){
		this.closeDialogButton.onclick(e);
	}.bind(this);
	if (enter_to_close)
	  this.addEventHandler(window, 'keyup', keyupHandler);
	
	document.body.appendChild(this.dialog);
}

Dialog.prototype.Confirm = function(content, confirm_callback, title, confirm_text, close_callback){
	if (title === undefined) title = "";
	if (confirm_text === undefined) confirm_text = "OK";
	
	this.dialog = document.createElement("div");
	this.dialog.id = "dialog";
	
	this.dialogTitle = document.createElement("div");
	this.dialogTitle.id = "dialogTitle";
	this.titleText = document.createElement("span");
	this.titleText.id = "titleText";
	this.titleText.innerHTML = title;
	this.closeDialogButton = document.createElement("div");
	this.closeDialogButton.id = "closeDialogButton";
	this.closeDialogButton.title = "Close the dialog";
	this.closeDialogButton.innerHTML = " X ";
	this.dialogTitle.appendChild(this.titleText);
	this.dialogTitle.appendChild(this.closeDialogButton);
	this.dialog.appendChild(this.dialogTitle);
	
	this.dialogBody = document.createElement("div");
	this.dialogBody.id = "dialogBody";
	this.dialogBody.innerHTML = content;
	this.dialog.appendChild(this.dialogBody);
	
	this.dialogButton = document.createElement("div");
	this.dialogButton.id = "dialogButton";
	this.dialogButton.innerHTML = "Cancel";
	this.dialog.appendChild(this.dialogButton);
	
	this.dialogConfirm = document.createElement("div");
	this.dialogConfirm.id = "dialogConfirm";
	this.dialogConfirm.innerHTML = confirm_text;
	this.dialog.appendChild(this.dialogConfirm);
	
	//set up event handlers
	this.dialogTitle.onmousedown = function(e){
		document.getElementsByTagName("html")[0].style.cursor = "default";
		document.getElementsByTagName("body")[0].style.cursor = "default";
	
		this.dialog.offY= e.clientY-parseInt(this.dialog.offsetTop);
		this.dialog.offX= e.clientX-parseInt(this.dialog.offsetLeft);
		this.addEventHandler(window, "mousemove", this.move);
	}.bind(this);
	this.dialogTitle.onmouseup = function(e){
		document.getElementsByTagName("html")[0].style.cursor = "";
		document.getElementsByTagName("body")[0].style.cursor = "";
		this.removeEventHandler(window, "mousemove", this.move);
	}.bind(this);
	var keyupHandler = function(e){
		if (e.keyCode === 13){
			this.dialogConfirm.onclick();
		}
		if (e.keyCode === 27){
			this.closeDialogButton.onclick();
		}
	}.bind(this);
	this.closeDialogButton.onclick = function(e){
		this._close();
		this.removeEventHandler(window, 'keyup', keyupHandler);
		if (typeof(close_callback) === "function")
			close_callback();
	}.bind(this);
	this.dialogButton.onclick = function(e){
		this.closeDialogButton.onclick();
	}.bind(this);
	this.dialogConfirm.onclick = function(e){
		this.closeDialogButton.onclick();
		if (typeof(confirm_callback) === "function")
			confirm_callback();
	}.bind(this);
	this.addEventHandler(window, 'keyup', keyupHandler);
	
	document.body.appendChild(this.dialog);
}


Dialog.prototype.move = function(e){
	this.dialog.style.position = "absolute";
	this.dialog.style.top = (e.clientY - this.dialog.offY) + "px";
	this.dialog.style.left = (e.clientX - this.dialog.offX) + 'px';
}