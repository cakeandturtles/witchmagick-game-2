var img_path = "assets/images/";
var snd_path = "assets/sounds/";

function ResourceManager(){
	//IMAGE VARIABLE DECLARATION
	this.images_loaded = 0;
	this.image_names = [
		"player_grey_sheet"
		,"tile_grey_sheet"
	];
	this.necessary_images = 1;
	this.num_images = this.image_names.length;
	
	//SOUND VARIABLE DECLARATION
	this.play_sound = true;
	this.play_music = true;
	this.can_play_sound = true;
	this.audio_context;
	try{
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		this.audio_context = new AudioContext();
	}catch(e){
		console.log(e);
		this.audio_context = null;
		this.play_sound = false;
		this.play_music = false;
		this.can_play_sound = false;
	}
	this.sounds_loaded = 0;
	this.sound_names = [
		"jump"
		,"land"
		,"LA_Stairs"
		,"locked"
		,"checkpoint"
		,"hurt"
		,"pickup"
		,"LA_Chest_Open"
		,"switchglitch"
		,"error"
	];
	this.necessary_sounds = 0;
	this.num_sounds = this.sound_names.length;
	
	this.final_callback = {};
}

ResourceManager.prototype.DisplayLoadScreen = function(canvas){
	/*var ctx = canvas.getContext('2d');
	ctx.scale(2,2);
	
	//Display the LOADING... screen
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	ctx.fillStyle = "rgb(255,255,255)";
	//ctx.font = "24px pixelFont";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("LOADING GAME...", 134, canvas.width/2+25);
	ctx.fillText("PLEASE WAIT :)", 134, canvas.height/2+80);*/
}

ResourceManager.prototype.CheckIfLoaded = function(){
	if (this.images_loaded >= this.necessary_images && this.sounds_loaded >= this.necessary_sounds){
		if (this.final_callback){
			this.final_callback();
			this.final_callback = function(){};
		}
	}
}

ResourceManager.prototype.ImageLoad = function(){ 
	this.images_loaded++;
	this.CheckIfLoaded(); 
}
ResourceManager.prototype.SoundLoad = function(){ 
	this.sounds_loaded++; 
	this.CheckIfLoaded(); 
}

//LOAD ALL THE RESOURCES
ResourceManager.prototype.LoadResources = function(canvas, finalCallback){
	this.final_callback = finalCallback;
	
	//Display the loading screen while everything else is loading...
	this.DisplayLoadScreen(canvas);

	//Load Images
	for (var i = 0; i < this.image_names.length; i++){
		var timeoutCallback = (function(self, img){
			self[img] = new Image();
			self[img].onload = self.ImageLoad();
			self[img].src = img_path + img + ".png";
		})(this, this.image_names[i]);
		
		setTimeout(timeoutCallback, 0);
	}
	
	if (this.audio_context === null || !this.can_play_sound){ 
		this.sounds_loaded = this.sound_names.length;
		return;
	}
	//Load Sounds
	for (var i = 0; i < this.sound_names.length; i++){
		var timeoutCallback = (function(self){
			var snd = self.sound_names[i];
			self.loadBuffer(snd_path + snd + ".mp3", snd);
		})(this);
		
		setTimeout(timeoutCallback, 0);
	}
}

ResourceManager.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
  
    // Asynchronously decode the audio file data in request.response
    loader.audio_context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader[index] = buffer;
		loader.SoundLoad();
		//Force sequential sound loading
		//setTimeout(loader.LoadNextSound.bind(loader), 0);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    console.log('BufferLoader: XHR error');
  }

  request.send();
}