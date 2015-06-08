var removeEventHandler = function(elem,eventType,handler) {
 if (elem.removeEventListener) 
    elem.removeEventListener (eventType,handler,false);
 if (elem.detachEvent)
    elem.detachEvent ('on'+eventType,handler); 
}
var addEventHandler = function(elem,eventType,handler) {
 if (elem.addEventListener)
     elem.addEventListener (eventType,handler,false);
 else if (elem.attachEvent)
     elem.attachEvent ('on'+eventType,handler); 
}

//http://www.hunlock.com/blogs/Totally_Pwn_CSS_with_Javascript
function getCSSRule(ruleName, deleteFlag) {               // Return requested style obejct
   ruleName=ruleName.toLowerCase();                       // Convert test string to lower case.
   if (document.styleSheets) {                            // If browser can play with stylesheets
      for (var i=0; i<document.styleSheets.length; i++) { // For each stylesheet
         var styleSheet=document.styleSheets[i];  		 // Get the current Stylesheet
         var ii=0;                                        // Initialize subCounter.
         var cssRule=false;                               // Initialize cssRule. 
         do {                                             // For each rule in stylesheet
            if (styleSheet.cssRules && styleSheet.cssRules !== null) {                    // Browser uses cssRules?
               cssRule = styleSheet.cssRules[ii];         // Yes --Mozilla Style
            } else if (styleSheet.rules && styleSheet.rules !== null){                                      // Browser usses rules?
               cssRule = styleSheet.rules[ii];            // Yes IE style. 
            }else{
				break;
			}				// End IE check.
            if (cssRule)  {                               // If we found a rule...
               if (cssRule.selectorText.toLowerCase()==ruleName) { //  match ruleName?
                  if (deleteFlag=='delete') {             // Yes.  Are we deleteing?
                     if (styleSheet.cssRules) {           // Yes, deleting...
                        styleSheet.deleteRule(ii);        // Delete rule, Moz Style
                     } else {                             // Still deleting.
                        styleSheet.removeRule(ii);        // Delete rule IE style.
                     }                                    // End IE check.
                     return true;                         // return true, class deleted.
                  } else {                                // found and not deleting.
                     return cssRule;                      // return the style object.
                  }                                       // End delete Check
               }                                          // End found rule name
            }                                             // end found cssRule
            ii++;                                         // Increment sub-counter
         } while (cssRule)                                // end While loop
      }                                                   // end For loop
   }                                                      // end styleSheet ability check
   return false;                                          // we found NOTHING!
}                                                         // end getCSSRule 
function killCSSRule(ruleName) {                          // Delete a CSS rule   
   return getCSSRule(ruleName,'delete');                  // just call getCSSRule w/delete flag.
}                                                         // end killCSSRule
function addCSSRule(ruleName) {                           // Create a new css rule
   if (document.styleSheets) {                            // Can browser do styleSheets?
      if (!getCSSRule(ruleName)) {                        // if rule doesn't exist...
         if (document.styleSheets[0].addRule) {           // Browser is IE?
            document.styleSheets[0].addRule(ruleName, null,0);      // Yes, add IE style
         } else {                                         // Browser is IE?
            document.styleSheets[0].insertRule(ruleName+' { }', 0); // Yes, add Moz style.
         }                                                // End browser check
      }                                                   // End already exist check.
   }                                                      // End browser ability check.
   return getCSSRule(ruleName);                           // return rule we just created.
} 


function randomCSSGradient(ele){
	color1 = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
	color2 = $ui.color.triadic(color1)[1];

	ele.style.background = 
		"linear-gradient("+color1+","+color2+")";
	ele.style.color = color2;
	
	return ensureReadabilityContrast(color1, color2);
}

function ensureReadabilityContrast(color1, color2){
	var rgb1 = hexToRgb(color1);
	var rgb2 = hexToRgb(color2);
	var hsl1 = rgbToHsl(rgb1.r, rgb1.g, rgb1.b);
	var hsl2 = rgbToHsl(rgb2.r, rgb2.g, rgb2.b);
	
	var lightDelta = Math.abs(hsl1[2] - hsl2[2]);
	while (lightDelta < 0.5){
		hsl2[2] += 0.1;
		lightDelta = Math.abs(hsl1[2] - hsl2[2]);
	}
	if (hsl2[2] > 1.0) hsl2[2] -= 1.0;
	
	rgb2 = hslToRgb(hsl2[0], hsl2[1], hsl2[2]);
	color2 = rgbToHex(rgb2[0], rgb2[1], rgb2[2]);
	return [color1, color2];
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

//http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}