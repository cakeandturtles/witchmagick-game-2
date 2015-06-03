function GlitchOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-glitch", "option_glitch1.png", "trans.png");
	
	this.is_selectable = false;
	this.is_toggleable = true;
}
extend(Option, GlitchOption);

GlitchOption.prototype.onContextMenu = function(level){
	if (hasClass(this.dom, "selected")){
		Dialog.Close();
		addClass(this.dom, "selected");
	}else{
		level.pause();
		
		Dialog.Alert("", "room glitch manager", function(){
			this.architect.tryResume();
			removeClass(this.dom, "selected");
		}.bind(this));
	}
}