var CANVAS_WIDTH;
var CANVAS_HEIGHT;

window.onload = function(){
	var canvas = document.getElementById("glitch_canvas");
	CANVAS_WIDTH = canvas.width;
	CANVAS_HEIGHT = canvas.height;
	
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#ff00aa";
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}