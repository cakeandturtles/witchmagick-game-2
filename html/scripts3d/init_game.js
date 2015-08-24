function Game(canvas){
	this.canvas = canvas;
	
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl){ alert("WebGL isn't available"); }
	
	//Configure webgl
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	//Load shaders and initialize attribute buffers
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);
}

Game.CANVAS_WIDTH;
Game.CANVAS_HEIGHT;