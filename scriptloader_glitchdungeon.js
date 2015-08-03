function glitchdungeon_loadScripts(callback){
	var files = [
	
		//webgl libraries and utilities
		{src: "javascript/lib/glMatrix-0.9.5.min.js"},
		{src: "javascript/lib/webgl-utils.js"},
		
		//Colorflow (for triadic color creation for css gradient
		{src: "javascript/lib/colorflow.min.js"},
		
		//timbre.js (for music generation)
		{src: "javascript/lib/timbre.js"},
	  	{src: "javascript/lib/subcollider.js"},
		
		//custom context menu and dialog libraries (custom made)
		{src: "javascript/lib/contextmenu.js"},
		{href: "javascript/lib/contextmenu.css"},
		{src: "javascript/lib/dialog.js"},
		{href: "javascript/lib/dialog.css"},
		
		{href: "style.css"},
		
		{src: "javascript/utils.js"},
		
		//managers managers
		{src: "javascript/input_manager.js"},
		//file manager (using nodejs with nodewebkit)
		{src: "javascript/file_manager.js"},
		{src: "javascript/asset_manager.js"},
		
		//entities
			//abstract
			{src: "javascript/entities/abstract/GLObject.js"},
			{src: "javascript/entities/abstract/GLSprite.js"},
			{src: "javascript/entities/abstract/GLAnimation.js"},
			{src: "javascript/entities/abstract/GameObject.js"},
			{src: "javascript/entities/abstract/GL3dObject.js"},
			
			//concrete
			{src: "javascript/entities/Triangle.js"},
			{src: "javascript/entities/Player.js"},
			{src: "javascript/entities/Npc.js"},
			{src: "javascript/entities/Checkpoint.js"},
			
		//level managers
		{src: "javascript/levels/Loader.js"},
		{src: "javascript/levels/Tile.js"},
		{src: "javascript/levels/tile_hydra.js"},
		{src: "javascript/levels/Camera.js"},
		{src: "javascript/levels/Room.js"},
		{src: "javascript/levels/Level.js"},
			//architect && options
			{src: "javascript/levels/architect/architect.js"},
			{src: "javascript/levels/architect/option.js"},
			{src: "javascript/levels/architect/save_option.js"},
			{src: "javascript/levels/architect/level_option.js"},
			{src: "javascript/levels/architect/pause_option.js"},
			{src: "javascript/levels/architect/space_option.js"},
			{src: "javascript/levels/architect/camera_option.js"},
			{src: "javascript/levels/architect/glitch_option.js"},
			{src: "javascript/levels/architect/tile_option.js"},
			{src: "javascript/levels/architect/entity_option.js"},
			
		
		//Soundscape
		{src: "javascript/music/soundscape.js"},
		
		//glitches
		{src: "javascript/glitches/Glitch.js"},
		{src: "javascript/glitches/NoneGlitch.js"},
		{src: "javascript/glitches/FloorGlitch.js"},
		{src: "javascript/glitches/WallGlitch.js"},
		{src: "javascript/glitches/FeatherGlitch.js"},
		{src: "javascript/glitches/TeleportGlitch.js"},
		{src: "javascript/glitches/WrapGlitch.js"},
		
		//shaders
		//{src: "shaders/vertex_shader.js", type: "x-shader/x-vertex"},
		//{src: "shaders/fragment_shader.js", type: "x-shader/x-fragment"},
		
		//and finally, load the game (!!!
		{src: "javascript/Game.js"},
	];
	
	loadExternalScriptsSequentially(files, callback);
}