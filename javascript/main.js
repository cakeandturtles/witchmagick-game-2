var gl;

function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl", {antialias:false});
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}


function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

function createShader(gl, type, str){
	var shader;
	if (type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}


var shaderProgram;

function initShaders(vertShaderPath, fragShaderPath, callback) {
	var vertexShader;
	var fragmentShader;
	
	shaderProgram = gl.createProgram();
	
	var completed_callback = function(){
		gl.linkProgram(shaderProgram);

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert("Could not initialise shaders");
		}

		gl.useProgram(shaderProgram);

		shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
		
		shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
		gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
		
		shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
		gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

		shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
		gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
		
		shaderProgram.alpha = gl.getUniformLocation(shaderProgram, "uAlpha");

		shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
		shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
		shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
		shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
		
		callback();
	};

	loadExternalFile(vertShaderPath, function(err, text){
		if (err){
			console.log("couldn't initialize vertex shader");
		}
		
		vertexShader = createShader(gl, "x-shader/x-vertex", text);
		gl.attachShader(shaderProgram, vertexShader);
		
		if (typeof(fragmentShader) !== "undefined"){
			completed_callback();
		}
	});
	loadExternalFile(fragShaderPath, function(err, text){
		if (err){
			console.log("couldn't initialize fragment shader");
		}
		
		fragmentShader = createShader(gl, "x-shader/x-fragment", text);
		gl.attachShader(shaderProgram, fragmentShader);
		
		if (typeof(vertexShader) !== "undefined"){
			completed_callback();
		}
	});
}

var mvMatrix;
var mvMatrixStack;
var pMatrix;

function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}
function mvPopMatrix() {
	if (mvMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}
function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	
	var normalMatrix = mat3.create();
	mat4.toInverseMat3(mvMatrix, normalMatrix);
	mat3.transpose(normalMatrix);
	gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

function degToRad(degrees) {
	return degrees * Math.PI / 180;
}

function drawScene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.identity(pMatrix);
	mat4.identity(mvMatrix);
	
	game.render();
}

function webGLStart(canvas, vertShaderPath, fragShaderPath, callback) {
	mvMatrix = mat4.create();
	mvMatrixStack = [];
	pMatrix = mat4.create();
	
	initGL(canvas);
	initShaders(vertShaderPath, fragShaderPath, function(){
		gl.clearColor(0.0, 0.0, 0.0, 0.0);
		gl.disable(gl.DEPTH_TEST);
		
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.enable(gl.BLEND);
	
		callback();
	});
}

function initGradient(){
	//manipulate css to prettify dialogs and stuff I guess
	var colors = randomCSSGradient(document.body);
	var dialogCSS = getCSSRule("#dialog");
	dialogCSS.style.background = colors[0];
	dialogCSS.style.color = colors[1];
	var dialogConfirmCSS = getCSSRule("#dialogConfirm");
	dialogConfirmCSS.style.background = colors[1];
	dialogConfirmCSS.style.color = colors[0];
}

function initTimbre(){
  sc.use("prototype");
  
  timbre.setup({f64:true});
  if (timbre.envmobile) {
      timbre.setup({samplerate:timbre.samplerate * 0.5});
  }
  timbre.amp = 0.6;
}

var lastTime = 0;
var updateTime = 22;

function update() {
	game.update(1.0);
}

function tick() {
	update();
	drawScene();

	var timeNow = new Date().getTime();
	var elapsed = timeNow - lastTime;
	var timeout_time = updateTime - (elapsed - updateTime);
	if (timeout_time < 0) timeout_time = 0;

	setTimeout(function(){
		requestAnimFrame(tick);
	}, timeout_time);
	
	lastTime = timeNow;
}

var game;

function main(){
	var game_canvas = document.getElementById("enchanted-canvas");
	var text_canvas = document.getElementById("text-canvas");
	var bg_canvas = document.getElementById("background-canvas");
	game_canvas.oncontextmenu = function(e){
		e.preventDefault();
		return false;
	}
	
	initGradient();
	initTimbre();
	webGLStart(game_canvas, "shaders/vertex.glsl", "shaders/fragment.glsl", function(){
		game = new Game(game_canvas, text_canvas, bg_canvas);
		lastTime = new Date().getTime();
		tick();
	});
}