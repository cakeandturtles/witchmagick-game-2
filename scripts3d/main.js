var gl;
var program;

var GlitchDungeon = function(){};
GlitchDungeon.game = {};
GlitchDungeon.resource_manager = {};
GlitchDungeon.init = function(){
	var canvas = document.getElementById("glitch_canvas");
	Game.CANVAS_WIDTH = canvas.width;
	Game.CANVAS_HEIGHT = canvas.height;
	
	GlitchDungeon.game = new Game(canvas);
	GlitchDungeon.resource_manager = new ResourceManager();
	GlitchDungeon.resource_manager.LoadResources(canvas, function(){
		GlitchDungeon.game.start();
	});
}

var color1;
var color2;
function randomizeCSSColor(){
	color1 = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
	color2 = $ui.color.triadic(color1)[1];

	document.body.style.background = 
		"linear-gradient("+color1+","+color2+")";
	document.body.style.color = color2;
}

window.onload = function(){
	randomizeCSSColor();
	GlitchDungeon.init();
	
	document.getElementById("eyex").onchange = function(e){
		GlitchDungeon.game.room.camera.eye[0] = this.value;
	}
	document.getElementById("eyey").onchange = function(e){
		GlitchDungeon.game.room.camera.eye[1] = this.value;
	}
	document.getElementById("eyez").onchange = function(e){
		GlitchDungeon.game.room.camera.eye[2] = this.value;
	}
	
	document.getElementById("atx").onchange = function(e){
		GlitchDungeon.game.room.camera.at[0] = this.value;
	}
	document.getElementById("aty").onchange = function(e){
		GlitchDungeon.game.room.camera.at[1] = this.value;
	}
	document.getElementById("atz").onchange = function(e){
		GlitchDungeon.game.room.camera.at[2] = this.value;
	}
}