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

window.onload = GlitchDungeon.init;