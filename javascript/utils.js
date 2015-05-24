function randomCSSGradient(ele){
	color1 = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
	color2 = $ui.color.triadic(color1)[1];

	ele.style.background = 
		"linear-gradient("+color1+","+color2+")";
	ele.style.color = color2;
}

function isRightMB(e){
	var is_right_mb;
	e = e || window.event;
	if ("which" in e)
		is_right_mb = e.which == 3;
	else if ("button" in e)
		is_right_mb = e.button == 2;
	return is_right_mb;
}

//http://jaketrent.com/post/addremove-classes-raw-javascript/
function hasClass(ele, cls){
	return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}
function addClass(ele, cls){
	if (!hasClass(ele,cls)) ele.className += " "+cls;
}
function removeClass(ele,cls){
	if (hasClass(ele,cls)){
		var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className = ele.className.replace(reg, '');
	}
}

function isEmpty(obj){
	return Object.keys(obj).length === 0;
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

function getObjectKeys(obj){
	var keys = [];
	for (var key in obj){
		if (obj.hasOwnProperty(key)){
			keys.push(key);
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

function defaultTo(variable, def_val){
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