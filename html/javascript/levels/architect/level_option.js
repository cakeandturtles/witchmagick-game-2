function LevelOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "level-architect-newlevel", "option_level.png", "trans.png");
	
	this.is_selectable = false;
	this.is_toggleable = true;
}
extend(Option, LevelOption);

LevelOption.prototype.onContextMenu = function(level){
	var self = this;
	
	if (hasClass(this.dom, "selected")){
		Dialog.Close();
		addClass(this.dom, "selected");
	}else{
		level.pause();
		
		Dialog.Confirm("generate new level<br/><br/>NOTE: you will lose any unsaved progress on this level", function(){
			game.NewLevel();
		}, "new level", "new level", function(){
			this.architect.tryResume()
			removeClass(this.dom, "selected");
		}.bind(this));
	}
}