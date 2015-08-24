function Player(){
	this.x = 0;
	this.y = 0;
}

Player.prototype.Jump = function(){
	this.y -= 10;
}

player = new Player();

function Corrupt(object, func, f){
	//or something
	object[func] = function(){
		SandBox(object);
		f();
		UnSandBox(object);
	};
}

//Correct way to corrupt the jump function
Corrupt(player, "Jump", function(){
	this.y -= 20;
});

//How ideally I could write a corrupted function...
Corrupt(player, "Jump", function(){
	y -= 20;
});

function SandBox(object){
	//I need this function to basically go through and do
	//var x = player.x;
	//var y = player.y;
	//if player is passed as an object,
	//but set these variables in the scope of the calling function
	//...
	//is this possible???
}

function UnSandBox(object){
	//now I need to basically, if player is object
	//player.x = x;
	//player.y = y;
	//and get the x and y (and basically other enumerated variables)
	//from the calling function
	//...
	//this should be able by passing the variables as an object and looping
	//through those
	//e.g. object[key] = variable[key]];
}