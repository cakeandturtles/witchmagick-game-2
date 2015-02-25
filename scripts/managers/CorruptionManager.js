var Corruption = function(room){
	this.object_menu = document.getElementById("corruption_object_menu");
	this.current_object = null;
	this.method_menu = document.getElementById("corruption_method_menu");
	this.textarea = document.getElementById("glitch_textarea");
	this.corrupt_button = document.getElementById("glitch_button");
	
	var self = this;
	this.object_menu.onchange = function(){
		self.populateMethodMenu();
	}
	this.method_menu.onchange = function(){
		var method = self.current_object[getSelected(self.method_menu)];
		method = {
			arguments: getParamNames(method),
			body: method.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1]
		};
		method.body = method.body.trim();
		method.body = unindentMultilineString(method.body);
		self.textarea.value = method.body;
	}
	this.corrupt_button.onclick = function(){
		self.saveAndInjectMethod();
	}
	this.textarea.onkeydown = function(event){
		self.textareaKeyDown(event);
	}
	
	this.populateObjectMenu(room);
	this.populateMethodMenu();	
}

Corruption.prototype.textareaKeyDown = function(event){
	if (!(!(event.which == 115 && (event.ctrlKey || event.metaKey)) && !(event.which == 19))){		
		this.saveAndInjectMethod();
		event.preventDefault();
		return false;
	}
	//tab was pressed
	if (event.keyCode === 9){
		//http://stackoverflow.com/questions/6140632/how-to-handle-tab-in-textarea
		// get caret position/selection
        var start = this.textarea.selectionStart;
        var end = this.textarea.selectionEnd;

        var value = this.textarea.value;

        // set textarea value to: text before caret + tab + text after caret
        this.textarea.value = value.substring(0, start)
                    + "\t"
                    + value.substring(end);

        // put caret at right position again (add one for the tab)
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;

        // prevent the focus lose
        event.preventDefault();
	}
	return true;
}


Corruption.prototype.saveAndInjectMethod = function(){
	var method_name = getSelected(this.method_menu);
	var method = this.current_object[method_name];
	method = {
		arguments: getParamNames(method),
		body: this.textarea.value
	};
	method.body = indentMultilineString(method.body);
	
	var func = new Function(method.arguments, method.body);
	this.current_object[method_name] = func;
}

Corruption.prototype.populateObjectMenu = function(room){
	this.room_objects = getObjectKeys({player: room.player});
	populateSelectOptions(this.object_menu, this.room_objects, true);
}

Corruption.prototype.populateMethodMenu = function(){
	var object_name = getSelected(this.object_menu);
	
	var object = this.room_objects[object_name];
	this.current_object = object;
	
	this.object_methods = getObjectMethods(object);
	populateSelectOptions(this.method_menu, this.object_methods, true);
}