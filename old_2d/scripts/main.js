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
function randomCSSGradient(ele){
	color1 = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
	color2 = $ui.color.triadic(color1)[1];

	ele.style.background = 
		"linear-gradient("+color1+","+color2+")";
	ele.style.color = color2;
}

window.onload = function(){
	randomCSSGradient(document.body);
	GlitchDungeon.init();
}