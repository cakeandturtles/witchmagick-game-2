function PauseOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-pause", "option_pause.png", "trans.png");
	
	this.is_selectable = false;
	this.is_toggleable = true;
}
extend(Option, PauseOption);

PauseOption.prototype.ToggleOn = function(){
	this.architect.pause();
}

PauseOption.prototype.ToggleOff = function(){
	this.architect.resume();
}