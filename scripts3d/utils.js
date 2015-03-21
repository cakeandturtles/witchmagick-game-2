function getObjectKeys(obj){
	var keys = {};
	for (var key in obj){
		if (obj.hasOwnProperty(key)){
			keys[key] = obj[key];
		}
	}
	return keys;
}

function getObjectMethods(obj){
	var keys = {};
	for (var key in obj){
		if (typeof obj[key] === "function"){
			keys[key] = obj[key];
		}
	}
	return keys;
}

function getImage(img_name){
	return GlitchDungeon.resource_manager[img_name];
}

function populateSelectOptions(select, options, useKeyAsValue){
	select.innerHTML = "";
	for (var key in options){
		var option = document.createElement("option");
		if (useKeyAsValue)
			option.value = key;
		else option.value = options[key];
		option.innerHTML = key;
		select.appendChild(option);
	}
}

function getSelected(menu){
	return menu.options[menu.selectedIndex].value
}

//http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
     result = [];
  return result;
}

function unindentMultilineString(str){
	var lines = str.split('\n');
	for (var i = 0; i < lines.length; i++){
		if (lines[i][0] === '\t'){
			lines[i] = lines[i].slice(1);
		}
	}
	str = lines.join('\n');
	return str;
}

function indentMultilineString(str){
	var lines = str.split('\n');
	for (var i = 0; i < lines.length; i++){
		lines[i] = '\t' + lines[i];
	}
	str = lines.join('\n');
	return str;
}

function gup(name){
	//http://stackoverflow.com/questions/8460265/get-a-variable-from-url-parameter-using-javascript
	name = RegExp ('[?&]' + name.replace (/([[\]])/, '\\$1') + '=([^&#]*)');
	return (window.location.href.match (name) || ['', ''])[1];
}

function playSound(sound_name, volume, time, loop){
	var resource_manager = GlitchDungeon.resource_manager;
	
	tryToPlay = null;
	loop = defaultValue(loop, false);

	if (!resource_manager.can_play_sound || (!resource_manager.play_sound || (!resource_manager.play_music && loop))) 
		return;
	//if the bg music isn't loaded, give it a second
	if (loop){
		if (resource_manager[sound_name] === undefined || resource_manager[sound_name] === null){
			tryToPlay = window.setTimeout(function(){bg_music = Utils.playSound(sound_name, volume, time, loop);}, 100);
			return;
		}
	}
	
	if (!resource_manager[sound_name]) return;

	//http://www.html5rocks.com/en/tutorials/webaudio/intro/
	var source = resource_manager.audio_context.createBufferSource(); //creates a sound source
	source.buffer = resource_manager[sound_name]; //tell the source which sound to play
	source.loop = loop;
	
	var v = volume || 1.0;
	//Create a gain node
	var gain_node = resource_manager.audio_context.createGain();
	source.connect(gain_node);
	gain_node.connect(resource_manager.audio_context.destination); //connect source to the speakers
	
	//Set the volume
	gain_node.gain.value = v;

	
	var t = time || 0;
	if (source.start)
		source.start(t); 
	//NOTE: on older systems, may have to use deprecated noteOn(time);
	else
		source.noteOn(t);
		
	return source;
}


//http://stackoverflow.com/questions/950087/include-a-javascript-file-in-another-javascript-file
function loadScript(url, callback){
	//Adding the script tag to the head as suggested before
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	
	//Then bind the event to the callback function.
	//There are several events for cross browser compatibility
	script.onreadystatechange = callback;
	script.onload = callback;
	
	//Fire the loading
	head.appendChild(script);
}

function readTextFile(file){
	var text = null;
	var rawFile = new XMLHttpRequest();
	try{
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = function ()
		{
			if(rawFile.readyState === 4)
			{
				if(rawFile.status === 200 || rawFile.status == 0)
				{
					text = rawFile.responseText;
				}
			}
		}
		rawFile.send(null);
	}catch(e){
		console.log(e);
	}
	return text;
}

function readTextFileAsync(file, callback){
	var rawFile = new XMLHttpRequest();
	try{
		rawFile.open("GET", file, true);
		rawFile.onreadystatechange = function ()
		{
			if(rawFile.readyState === 4)
			{
				if(rawFile.status === 200 || rawFile.status == 0)
				{
					callback(rawFile.responseText);
				}
			}
		}
		rawFile.send(null);
	}catch(e){
		
	}
}

//http://stackoverflow.com/questions/3808808/how-to-get-element-by-class-in-javascript
function getElementsByClass(matchClass) {
    var elems = document.getElementsByTagName('*'), i;
	var class_objects = [];
    for (i in elems) {
        if((' ' + elems[i].className + ' ').indexOf(' ' + matchClass + ' ')
                > -1) {
            class_objects.push(elems[i]);
        }
    }
	return class_objects;
}

//http://stackoverflow.com/questions/4152931/javascript-inheritance-call-super-constructor-or-use-prototype-chain
function extend(base, sub){
	// Avoid instantiating the base class just to setup inheritance
	// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
	// for a polyfill
	// Also, do a recursive merge of two prototypes, so we don't overwrite 
	// the existing prototype, but still maintain the inheritance chain
	// Thanks to @ccnokes
	var origProto = sub.prototype;
	sub.prototype = Object.create(base.prototype);
	for (var key in origProto)  {
		sub.prototype[key] = origProto[key];
	}
	// Remember the constructor property was set wrong, let's fix it
	sub.prototype.constructor = sub;
	// In ECMAScript5+ (all modern browsers), you can make the constructor property
	// non-enumerable if you define it like this instead
	Object.defineProperty(sub.prototype, 'constructor', { 
		enumerable: false, 
		value: sub 
	});
}

function defaultValue(variable, def_val){
	return typeof variable !== 'undefined' ? variable : def_val;
}

function sharpen(ctx){
	ctx.imageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
}

function drawLine(ctx, color, x1, y1, x2, y2, thickness, cap){
    cap = cap || "round";
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.lineCap = cap;
    ctx.stroke();
}

//http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function degToRad(degrees) {
	return degrees * Math.PI / 180;
}

function determinant(a, b, c, d, e, f, g, h, i){
	return (a*e*i + b*f*g + c*d*h) - (c*e*g + b*d*i + a*f*h);
}

//will return [a, b, c, m], given that the plane's equation is of the form ax + by + cz = m;
function planeEquation(P, Q, R){
	var PQ = vec3.fromValues(Q[0] - P[0], Q[1] - P[1], Q[2] - P[2]);
	var PR = vec3.fromValues(R[0] - P[0], R[1] - P[1], R[2] - P[2]);
	var abc = vec3.cross([], PQ, PR);
	abc[1] = Math.abs(abc[1]);
	abc[2] = Math.abs(abc[2]);
	abc.push(abc[0]*P[0] + abc[1]*P[1] + abc[2]*P[2]);
	return abc; //now abcm
}

function sign(p1, p2, p3){
	return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
}

function pointInTriangle(p, v1, v2, v3){
	var b1, b2, b3;
	b1 = sign(p, v1, v2) < 0.0;
	b2 = sign(p, v2, v3) < 0.0;
	b3 = sign(p, v3, v1) < 0.0;
	
	return ((b1 === b2) && (b2 === b3));
}

//treating a row vector [v1, v2, v3, 1] like a column vector
//returns a column vector
function matrixTimesVector(mat, vec){
	if (vec.length !== Math.sqrt(mat.length)){
		throw "INVALID DIMENSIONS ON MATRIX VECTOR MULTIPLICATION";
	}
	var result = vec4.create();
	
	//now multiply them together
	for (var i = 0; i < Math.sqrt(mat.length); i++){
		for (var j = 0; j < vec.length; j++){
			result[i] += mat[(j*4)+i] * vec[j];
		}
	}
	return result;
}

function flatten(input){
	//return _.flatten(input);
	var flattened = [];
	var done = false;
	while (!done){
		done = true;
		flattened=[];
		for (var i=0; i<input.length; ++i) {
			var current = input[i];
			if (current.length !== undefined){
				done = false;
				for (var j=0; j<current.length; ++j)
					flattened.push(current[j]);
			}else{
				flattened.push(current);
			}
		}
		input = flattened;
	}
	return flattened;
}