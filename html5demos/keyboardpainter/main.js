var origin_x = 0;
var origin_y = 0;

var pix_x = 0;
var pix_y = 0;
var pix_w = 1;
var pix_h = 1;
function setPixX(value){
	pix_x = value;
	document.getElementById("pix_x").innerHTML = value;
	
	/*ctx2d.strokeStyle = "#444444";
	ctx2d.strokeRect(pix_x-1, pix_y-1, pix_w+2, pix_h+2);*/
}
function setPixY(value){
	pix_y = value;
	document.getElementById("pix_y").innerHTML = value;
	
	/*ctx2d.strokeStyle = "#444444";
	ctx2d.strokeRect(pix_x-1, pix_y-1, pix_w+2, pix_h+2);*/
}

var canvas;
var ctx2d;


var textarea;
var command_prompt;
function init(){
	canvas = document.getElementById("paint_canvas");
	ctx2d = canvas.getContext("2d");
	ctx2d.fillStyle = "#aaaaaa";
	ctx2d.fillRect(0, 0, canvas.width, canvas.height);
	
	origin_x = canvas.width/2;
	origin_y = canvas.height/2;
	setPixX(origin_x);
	setPixY(origin_y);
	
	
	textarea = document.getElementById("textarea");
	command_prompt = document.getElementById("command_prompt");
	
	document.getElementById("clear_text_button").onclick = function(){
		textarea.innerHTML = "";
		command_prompt.innerHTML = "";
	}
}
window.onload = init;

var macros = [];
var curr_macro = [];
var recording_macro = false;
var shift = false;
var ctrl = false;

window.onkeyup = function(e){
	if (e.keyCode === 16) shift = false;
	else if (e.keyCode === 17) ctrl = false;
}

window.onkeydown = function(e){
	if (e.keyCode === 16) shift = true;
	else if (e.keyCode === 17) ctrl = true;
	
	var keyObj = {
		shift: shift,
		ctrl: ctrl,
		keyCode: e.keyCode
	};
	if (e.keyCode === 32){	//space
		if (recording_macro){
			macros.push(curr_macro);
			curr_macro = [];
			command_prompt.innerHTML = "end macro record";
		}else{
			command_prompt.innerHTML = "begin macro record";
			textarea.innerHTML = "";
		}
	
		recording_macro = !recording_macro;
	}
	else{
		if (e.keyCode === 13){
			var text = "replay macro";
			if (recording_macro){
				var macro = macros[macros.length-1];
				for (var i = 0; i < macro.length; i++){
					curr_macro.push(macro[i]);
				}
				text = "recording: " + text;
			}
			textarea.innerHTML = "";
			execute(macros[macros.length-1]);
			command_prompt.innerHTML = text;
		}else{
			if (recording_macro)
				curr_macro.push(keyObj);
			execute_single(keyObj);
		}
	}
}

function execute(macro){
	for (var i = 0; i < macro.length; i++){
		execute_single(macro[i]);
	}
}

function execute_single(keyObj){
	var text = "";
	
	var key = keyObj.keyCode;
	
	//painting pixel colors
	switch(key){
		case 49: //1: red		
			ctx2d.fillStyle = "#ff0000";
			ctx2d.fillRect(pix_x, pix_y, 1, 1);
			text = "paint pixel red";
			break;
		case 50: //2: green		
			ctx2d.fillStyle = "#00ff00";
			ctx2d.fillRect(pix_x, pix_y, 1, 1);
			text = "paint pixel green";
			break;
		case 51: //3: blue		
			ctx2d.fillStyle = "#0000ff";
			ctx2d.fillRect(pix_x, pix_y, 1, 1);
			text = "paint pixel blue";
			break;
		case 52: //4: cyan		
			ctx2d.fillStyle = "#00ffff";
			ctx2d.fillRect(pix_x, pix_y, 1, 1);
			text = "paint pixel cyan";
			break;
		case 53: //5: magenta		
			ctx2d.fillStyle = "#ff00ff";
			ctx2d.fillRect(pix_x, pix_y, 1, 1);
			text = "paint pixel magenta";
			break;
		case 54: //6: yellow		
			ctx2d.fillStyle = "#ffff00";
			ctx2d.fillRect(pix_x, pix_y, 1, 1);
			text = "paint pixel yellow";
			break;
		case 55: //7: black		
			ctx2d.fillStyle = "#000000";
			ctx2d.fillRect(pix_x, pix_y, 1, 1);
			text = "paint pixel black";
			break;
		case 56: //8: grey		
			ctx2d.fillStyle = "#aaaaaa";
			ctx2d.fillRect(pix_x, pix_y, 1, 1);
			text = "paint pixel grey";
			break;
		case 57: //9: white		
			ctx2d.fillStyle = "#ffffff";
			ctx2d.fillRect(pix_x, pix_y, 1, 1);
			text = "paint pixel white";
			break;
		default: break;
	}

	//pixel coordinate movement
	if (key === 37){	//left arrow
		setPixX(pix_x - pix_w);
		text = "move "+pix_w+" pixel left";
	}
	if (key === 38){	//up arrow
		setPixY(pix_y - pix_h);
		text = "move "+pix_h+" pixel up";
	}
	if (key === 39){	//right arrow
		setPixX(pix_x + pix_w);
		text = "move "+pix_w+" pixel right";
	}
	if (key === 40){	//down arrow
		setPixY(pix_y + pix_h);
		text = "move "+pix_h+" pixel down";
	}
	//utility
	if (key === 82 && keyObj.shift){
		setPixX(origin_x);
		setPixY(origin_y);
	}
	
	//END
	if (recording_macro)
		text = "recording: " + text;
	textarea.innerHTML = textarea.innerHTML + String.fromCharCode((96 <= key && key <= 105)? key-48 : key);
	command_prompt.innerHTML = text;
}