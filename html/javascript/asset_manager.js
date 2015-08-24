function Assets(){
}

Assets.images = {};
Assets.sounds = {};

Assets.GetImage = function(img_name, callback){
	if (img_name === undefined || img_name === null)
		return;
	
	if (Assets.images[img_name] !== undefined){
		if (Assets.images[img_name].complete){
			callback(Assets.images[img_name]);
			return;
		}
	}
	else{
		Assets.images[img_name] = new Image();
		Assets.images[img_name].src = "assets/images/" + img_name;
	}
	
	//do this if the image is not yet loaded
	//(use utils add event handler so if multiple attempts to get the image happen before
	//the image are loaded, they are all handled)
	addEventHandler(Assets.images[img_name], "load", function(e){
		callback(Assets.images[img_name]);
	});
}