function SpaceOption(architect, menu_dom){
	Option.call(this, architect, menu_dom, "", "trans.png", "trans.png");
	
	this.is_selectable = false;
}
extend(Option, SpaceOption);