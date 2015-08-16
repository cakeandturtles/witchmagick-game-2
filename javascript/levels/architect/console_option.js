function ConsoleOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-export", "option_save.png", "trans.png");
	
	this.is_selectable = false;
	this.is_toggleable = true;
	
	this.dialog = null;
	
	this.NORMAL = 0;
	this.RETURN = 1;
	this.ERROR = 2;
	this.USER_INPUT = 3;
	
	this.previous_inputs = [];
	this.previous_inputs_index = 0;
}
extend(Option, ConsoleOption);

ConsoleOption.prototype.HTMLtoJavaScript = function(text){
  return text.replace("<br>", "\n");
}

ConsoleOption.prototype.JavaScriptToHTML = function(text){
  return text.replace("\n", "<br>");
}

ConsoleOption.prototype.log = function(x, log_type){
  if (log_type === undefined) log_type = this.NORMAL;
	var message = document.createElement("div");
	message.className = "console_message";

  x = "" + x;
	x = this.JavaScriptToHTML(x);
	
	message.innerHTML = x;
	if (log_type === this.NORMAL){
	  message.style.color = "#000000";
	}
	else if (log_type === this.RETURN){
		message.style.color = "#aaaaaa";
	}
	else if (log_type == this.ERROR){
		message.style.color = "#ff0000";
		message.style.fontWeight = "bold";
	}else if (log_type === this.USER_INPUT){
	  message.style.fontStyle = "italic";
		message.style.color = "#aaaaaa";
	}
	
	this.console_messages.insertBefore(message, this.console_input_container);
}

ConsoleOption.prototype.onContextMenu = function(level){
	var self = this;
	
	if (this.dialog !== null){
		this.dialog.Close();
		addClass(this.dom, "selected");
	}else{
		level.pause();
		
		this.dialog = new Dialog();
		this.dialog.Alert("", "console", function(){}, false);
		
		this.dialog.dialog.style.width = "300px";
		this.dialog.dialog.style.minHeight = "240px";
		this.dialog.dialog.style.height = "auto";
		
		//add the console!!!
		this.console = document.createElement("div");
		this.console.id = "console";
		this.console_messages = document.createElement("div");
		this.console_messages.id = "console_messages";
		
		this.console_input_container = document.createElement("div");
		this.console_input_container.id = "console_input_container";
		this.console_input_container.className = "console_message";
		
		this.console_input_prompt = document.createElement("span");
		this.console_input_prompt.id = "console_input_prompt";
		this.console_input_prompt.innerHTML = "&nbsp;&gt;&nbsp;";
		
		this.console_input = document.createElement("div");
		this.console_input.id = "console_input";
		this.console_input.className = "console_message";
		this.console_input.contentEditable = true;
		this.console_input.onkeydown = function(e){
		  //enter
		  if (e.keyCode === 13 && !e.shiftKey){
		    var text = this.console_input.innerHTML;
		    this.log(text, this.USER_INPUT);
		    
		    //CONVERT FROM INNERHTML TO JAVASCRIPT TEXT!!
		    text = this.HTMLtoJavaScript(text);
		    
		    this.previous_inputs.push(text);
		    this.previous_inputs_index = this.previous_inputs.length;
		    
		    text = text.replace("console.log", "console_log");
		    try{
		      window.console_log = this.log;
		      var result = eval.call(window, text);
		      if (result !== undefined && result !== "undefined")
		        this.log(result, this.RETURN);
		      window.console_log = undefined;
		    }catch(e){
		      this.log(e, this.ERROR);
		    }
		    this.console_input.innerHTML = "";
		    e.preventDefault();
		  }
		  //UP ARROW
		  if (e.keyCode === 38){
		    if (this.previous_inputs_index > 0){
		      this.previous_inputs_index--;
		      var text = this.previous_inputs[this.previous_input_index];
		      this.console_input.value = text;
		    }
		  }
		  //DOWN ARROW
		  if (e.keyCode === 40){
		    if (this.previous_inputs_index < this.previous_inputs.length-1 && this.previous_inputs.length > 1){
		      this.previous_inputs_index++;
		      var text = this.previous_inputs[this.previous_inputs_index];
		      this.console_input.value = text;
		    }
		  }
		  e.stopPropagation();
		}.bind(this);
		
		var clear = document.createElement("div");
		clear.style.clear = "both";
		
		this.console_input_container.appendChild(this.console_input_prompt);
		this.console_input_container.appendChild(this.console_input);
		this.console_messages.appendChild(this.console_input_container);
		this.console_messages.appendChild(clear);
		this.console.appendChild(this.console_messages);
		
		this.dialog.AddElement(this.console);
		this.console_input.focus();
	}
}