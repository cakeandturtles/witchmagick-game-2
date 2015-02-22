var CANVAS_WIDTH;
var CANVAS_HEIGHT;

var GlitchDungeon = function(){};
GlitchDungeon.game = {};
GlitchDungeon.resource_manager = {};
GlitchDungeon.init = function(){
	var canvas = document.getElementById("glitch_canvas");
	CANVAS_WIDTH = canvas.width;
	CANVAS_HEIGHT = canvas.height;
	
	GlitchDungeon.game = new Game(canvas);
	GlitchDungeon.resource_manager = new ResourceManager();
	GlitchDungeon.resource_manager.LoadResources(canvas, function(){
		GlitchDungeon.game.start();
	});
}

window.onload = GlitchDungeon.init;